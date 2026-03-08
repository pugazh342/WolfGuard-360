package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

var badSignatures = []string{
	"UNION SELECT",
	"<SCRIPT>",
	"../../",
}

type WafLog struct {
	AttackerIP      string `json:"attacker_ip"`
	BlockedURL      string `json:"blocked_url"`
	PayloadDetected string `json:"payload_detected"`
}

// Rate Limiting Memory
type visitor struct {
	requests int
	lastSeen time.Time
}

var visitors = make(map[string]*visitor)
var mu sync.Mutex

const maxRequests = 5
const timeWindow = 10 * time.Second

// --- SaaS Configuration Variables ---
var (
	apiKey    string
	saasCloud string
	targetApp string
)

func init() {
	// 1. The WAF now DEMANDS configuration from the customer's environment
	apiKey = os.Getenv("WG_API_KEY")
	saasCloud = os.Getenv("SAAS_URL")
	targetApp = os.Getenv("TARGET_URL")

	if apiKey == "" || targetApp == "" {
		log.Fatal("🚨 FATAL: Missing WG_API_KEY or TARGET_URL environment variables. The agent cannot start.")
	}
	
	// Default to our local backend if they don't specify a custom SaaS cloud
	if saasCloud == "" {
		saasCloud = "http://backend:8000"
	}
}

// --- Send Authenticated Telemetry to the Cloud ---
func sendLogToSaaS(ip, blockedURL, payload string) {
	logData := WafLog{
		AttackerIP:      ip,
		BlockedURL:      blockedURL,
		PayloadDetected: payload,
	}
	
	jsonData, err := json.Marshal(logData)
	if err != nil {
		return
	}

	req, err := http.NewRequest("POST", saasCloud+"/waf/logs", bytes.NewBuffer(jsonData))
	if err != nil {
		return
	}

	// 🔒 We inject the Customer's API Key into the request header!
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", apiKey)

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	
	if err == nil {
		resp.Body.Close()
	} else {
		fmt.Printf("[WAF ⚠️] Failed to reach SaaS Cloud: %v\n", err)
	}
}

func isRateLimited(ip string) bool {
	mu.Lock()
	defer mu.Unlock()

	v, exists := visitors[ip]
	if !exists {
		visitors[ip] = &visitor{requests: 1, lastSeen: time.Now()}
		return false
	}

	if time.Since(v.lastSeen) > timeWindow {
		v.requests = 1
		v.lastSeen = time.Now()
		return false
	}

	v.requests++
	v.lastSeen = time.Now()
	return v.requests > maxRequests
}

func main() {
	// 2. We dynamically route traffic to the customer's specific app!
	parsedTarget, err := url.Parse(targetApp)
	if err != nil {
		log.Fatalf("Invalid TARGET_URL: %v", err)
	}

	proxy := httputil.NewSingleHostReverseProxy(parsedTarget)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		reqURL := r.URL.String()
		decodedURL, unescapeErr := url.QueryUnescape(reqURL)
		if unescapeErr != nil {
			decodedURL = reqURL
		}
		upperURL := strings.ToUpper(decodedURL)

		clientIP := strings.Split(r.RemoteAddr, ":")[0]

		// RATE LIMIT CHECK
		if isRateLimited(clientIP) {
			fmt.Printf("[WAF 🛑] RATE LIMIT EXCEEDED by %s\n", clientIP)
			go sendLogToSaaS(clientIP, decodedURL, "DDoS/Spam Attempt")
			http.Error(w, "429 Too Many Requests - Blocked by WolfGuard.", http.StatusTooManyRequests)
			return
		}

		// PAYLOAD SIGNATURE CHECK
		for _, sig := range badSignatures {
			if strings.Contains(upperURL, strings.ToUpper(sig)) {
				fmt.Printf("[WAF 🛡️] BLOCKED Attack: %s\n", decodedURL)
				go sendLogToSaaS(clientIP, decodedURL, sig)
				http.Error(w, "403 Forbidden - Blocked by WolfGuard WAF", http.StatusForbidden)
				return
			}
		}

		fmt.Printf("[WAF 🟢] Allowed: %s -> Forwarding to %s\n", reqURL, targetApp)
		proxy.ServeHTTP(w, r)
	})

	fmt.Printf("🛡️ WolfGuard Agent SECaaS v2.0\n")
	fmt.Printf("🎯 Protecting Target: %s\n", targetApp)
	fmt.Printf("☁️ Connected to Cloud: %s\n", saasCloud)
	log.Fatal(http.ListenAndServe(":8080", nil))
}