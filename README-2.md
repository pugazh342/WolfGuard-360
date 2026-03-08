# 🛡️ WolfGuard 360

**WolfGuard 360** is an enterprise-grade, containerized Web Application Firewall (WAF) and Attack Surface Monitoring platform. Built with a microservices architecture, it intercepts malicious HTTP traffic in real-time, actively maps target network topologies, and alerts Security Operations Center (SOC) teams via live webhooks.

## 🚀 Key Features

* **Real-Time Go WAF Engine:** A lightning-fast reverse proxy built in Golang that inspects raw HTTP traffic, instantly blocking SQL Injection (SQLi), Cross-Site Scripting (XSS), and Path Traversal payloads before they reach the backend.
* **Anti-DDoS Rate Limiting:** In-memory request tracking utilizing Mutex locks to safely throttle brute-force attacks and volumetric spam, returning HTTP 429 warnings to hostile IPs.
* **Live SOC Discord Alerting:** Acts as an automated security analyst, instantly pushing rich, detailed Embed Cards to a dedicated Discord webhook the exact millisecond a threat is neutralized.
* **OSINT Subdomain Discovery:** Integrates with the global `crt.sh` certificate database to passively enumerate target subdomains, identifying hidden attack surfaces without triggering target alarms.
* **Interactive Network Topology:** Visualizes the entire attack surface using a physics-based, draggable 2D node graph (`react-force-graph`), mapping primary domains to their resolved IPs and orbiting subdomains.
* **Live Threat Intelligence Dashboard:** A sleek, dark-themed React command center that streams WAF block logs, tracks asset vulnerabilities, and allows one-click CSV report exporting.
* **Cryptographic Access Control:** The entire command center is locked behind a secure authentication layer utilizing bcrypt password hashing and JSON Web Tokens (JWT).

## 🛠️ Tech Stack

* **Muscle (WAF Reverse Proxy):** Golang (`net/http/httputil`, `sync.Mutex`)
* **Brain (REST API & OSINT):** Python 3, FastAPI, SQLAlchemy, Requests (`crt.sh` integration)
* **Cockpit (Frontend SPA):** React, Tailwind CSS, Vite, `react-force-graph-2d`
* **Vault (Database):** PostgreSQL
* **Alerting:** Discord API (Webhooks)
* **Infrastructure:** Docker & Docker Compose

## ⚙️ Local Deployment

WolfGuard 360 is fully containerized. To spin up the entire microservices cluster locally:

1. Clone the repository.
2. Ensure Docker Desktop is running.
3. Execute the build command from the root directory:
   ```bash
   docker-compose up --build -d
   ```
4. Access the secure dashboard at `http://localhost:5173` .
5. Default Operator Credentials: `admin` / `wolfguard2026` .

## 🧪 Testing the WAF & Alerts
Once the cluster is online, you can simulate an attack by passing malicious payloads through the Go Engine port (`8080`).
Simulate an XSS Attack:
```bash
curl -X GET "http://localhost:8080/search?q=<script>alert(1)</script>"
```
Expected Result: 1. The terminal returns an `HTTP 403 Forbidden` error.
2. The telemetry instantly appears on the React Threat Intelligence dashboard.
3. A critical alert is instantly pushed to the configured Discord channel.

* Disclaimer: This project was built for educational purposes and portfolio demonstration. It should not be used as a standalone security appliance in a production environment without further hardening.