# 🛡️ WolfGuard 360 | Security-as-a-Service (SECaaS)

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

WolfGuard 360 is a fully containerized, enterprise-grade Security-as-a-Service (SECaaS) platform. It features a high-performance Web Application Firewall (WAF) deployed at the edge, managed by a centralized cloud control plane, and monitored via a real-time Security Operations Center (SOC) dashboard.

## 🏗️ Architecture

The platform is built on a modern microservices architecture, entirely orchestrated via Docker:

1. **The Edge Engine (Go):** A lightning-fast reverse proxy WAF that intercepts HTTP traffic, inspects payloads for malicious signatures (XSS, SQLi), blocks threats, and routes safe traffic to the target application.
2. **The SECaaS Cloud (Python/FastAPI):** The central brain of the operation. It manages multi-tenant JWT authentication, generates cryptographically secure API keys, and processes incoming threat telemetry.
3. **The Relational Vault (PostgreSQL):** A strictly structured database keeping customer configurations, active target URLs, and attack logs completely isolated.
4. **The Command Cockpit (React/Vite/Tailwind):** A sleek, dark-mode dashboard for users to register targets, copy deployment keys, and watch live threat intelligence feeds.

## ✨ Key Features

* **Real-Time Threat Intelligence:** As the Go Agent blocks attacks at the edge, logs are instantly pushed to the React dashboard via the Python API without requiring a page refresh.
* **Instant API Key Kill Switches:** Users can permanently revoke compromised WAF API keys directly from their inventory, instantly locking out unauthorized agents.
* **Live Discord Alerting:** Critical threat interceptions can be optionally routed to Discord webhooks for instant DevOps notification.
* **God Mode Oversight:** A hidden administrative dashboard featuring real-time Geo-IP tracking (via IP fallback algorithms) to monitor the global location of active SECaaS customers.
* **1-Click Deployment:** The entire company infrastructure boots simultaneously using Docker Compose.

## 🚀 Quickstart (1-Click Deploy)

Ensure you have [Docker](https://www.docker.com/) and Docker Compose installed.

1. Clone the repository:
   ```bash
   git clone https://github.com/pugazh342/WolfGuard-360.git
   cd WolfGuard-360
   ```
2. Launch the entire platform:
```bash
docker-compose up --build -d
```
Access the SOC Dashboard:
Navigate to `http://localhost:5173` in your browser.

Default Admin Credentials:

Username: `admin``

Password: `wolfguard2026`

## 📖 User Flow
Register a Target: Log into the React dashboard and register the URL of the application you want to protect.

Deploy the Agent: Copy the generated `WG_API_KEY`.

Engage the WAF: Run the Go WAF container, passing your API Key and Target URL as environment variables.

Monitor the Perimeter: Fire an attack (e.g., `http://localhost:8080/?q=<script>`) and watch it get intercepted by the WAF and instantly logged on your Threat Feed.

## 📸 Interface Preview

* Built as a comprehensive demonstration of Full-Stack Security Engineering, DevSecOps, and Microservice Architecture.
