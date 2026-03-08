# 🛡️ WolfGuard 360



**WolfGuard 360** is an enterprise-grade, containerized Web Application Firewall (WAF) and Attack Surface Monitoring platform. Built with a microservices architecture, it intercepts malicious HTTP traffic in real-time while actively scanning tracked assets for exposed vulnerabilities.

## 🚀 Key Features

* **Real-Time Go WAF Engine:** A lightning-fast reverse proxy built in Golang that inspects raw HTTP traffic, instantly blocking SQL Injection (SQLi), Cross-Site Scripting (XSS), and Path Traversal payloads.
* **Anti-DDoS Rate Limiting:** In-memory request tracking utilizing Mutex locks to safely throttle brute-force attacks and volumetric spam, returning HTTP 429 warnings.
* **Automated Threat Scanning:** A Python-based background worker that resolves IP addresses, maps open network ports, and brute-forces web servers to uncover exposed sensitive directories (e.g., `/.git/`, `/.env`, `/admin/`).
* **Cryptographic Access Control:** The entire React command center is locked behind a secure authentication layer utilizing bcrypt password hashing and expiring JSON Web Tokens (JWT).
* **Live Threat Intelligence:** A sleek, dark-themed React dashboard that streams WAF block logs and visualizes asset vulnerabilities in real-time.

## 🛠️ Tech Stack

* **Muscle (WAF Reverse Proxy):** Golang (`net/http/httputil`, `sync.Mutex`)
* **Brain (REST API & Scanners):** Python 3, FastAPI, SQLAlchemy, Passlib, PyJWT
* **Cockpit (Frontend SPA):** React, Tailwind CSS, Vite, Axios
* **Vault (Database):** PostgreSQL
* **Infrastructure:** Docker & Docker Compose

## ⚙️ Local Deployment

WolfGuard 360 is fully containerized. To spin up the entire microservices cluster locally:

1. Clone the repository.
2. Ensure Docker Desktop is running.
3. Execute the build command from the root directory:
   ```bash
   docker-compose up --build -d
   ```
4. Access the secure dashboard at `http://localhost:5173`.
5. Default Operator Credentials: admin / wolfguard2026.

## 🧪 Testing the WAF
Once the cluster is online, you can simulate an attack by passing malicious payloads through the Go Engine port (`8080`).
**Simulate an XSS Attack:**
```bash
curl -X GET "http://localhost:8080/health?search=<script>alert(1)</script>"
```
Expected Result: HTTP 403 Forbidden. The telemetry will instantly appear on the React Threat Intelligence dashboard.
* Disclaimer: This project was built for educational purposes and portfolio demonstration. It should not be used as a standalone security appliance in a production environment without further hardening.

