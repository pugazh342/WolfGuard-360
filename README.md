# 🛡️ WolfGuard 360 | Enterprise SECaaS & Edge WAF

![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge\&logo=go\&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge\&logo=python\&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge\&logo=FastAPI\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge\&logo=react\&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge\&logo=postgresql\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)

---

## 🚀 Overview

**WolfGuard 360** is a fully containerized, enterprise-grade **Security-as-a-Service (SECaaS)** platform engineered for modern DevSecOps environments. It combines a high-performance **Edge Web Application Firewall (WAF)** with a centralized cloud control plane and a real-time SOC dashboard.

The system is designed for **low-latency threat mitigation**, **multi-tenant scalability**, and **real-time security observability**.

---

## 🏗️ Core Architecture

WolfGuard 360 follows a **microservices-based architecture**, orchestrated via Docker for seamless scalability and deployment.

### 🔹 Edge Engine (Golang)

* High-performance reverse proxy WAF
* Real-time inspection of HTTP traffic
* Detects and blocks:

  * Cross-Site Scripting (XSS)
  * SQL Injection (SQLi)
  * Path Traversal
* Ensures only sanitized traffic reaches backend services

### 🔹 SECaaS Cloud (Python / FastAPI)

* Central intelligence and control layer
* Handles:

  * Multi-tenant JWT authentication
  * Secure API key generation
  * Asynchronous telemetry ingestion
* Acts as the orchestration brain of the platform

### 🔹 Relational Vault (PostgreSQL)

* Strongly structured persistence layer
* Features:

  * Tenant isolation
  * Target configuration storage
  * Immutable threat logs

### 🔹 Command Cockpit (React + Vite + Tailwind)

* Real-time SOC dashboard
* Features:

  * Live threat feed
  * Agent management
  * Dark-mode UI optimized for monitoring

---

## ✨ Enterprise Features

* **Real-Time Threat Telemetry**

  * Sub-second visibility of blocked attacks in the SOC dashboard

* **Instant API Key Revocation**

  * Immediate shutdown of compromised edge agents

* **Automated DevSecOps Alerting**

  * Critical events pushed to Discord webhooks

* **Global Oversight ("God Mode")**

  * Geo-IP tracking of active nodes using fallback strategies

* **Zero-Friction Deployment**

  * Entire system boots with a single Docker Compose command

---

## 🚀 Quickstart (Local Deployment)

### Prerequisites

* Docker
* Docker Compose

---

### 1. Clone Repository

```bash
git clone https://github.com/pugazh342/WolfGuard-360.git
cd WolfGuard-360
```

### 2. Launch Infrastructure

```bash
docker-compose up --build -d
```

### 3. Access Dashboard

```
http://localhost:5173
```

### 🔐 Default Admin Credentials

```
Username: admin
Password: wolfguard2026
```

---

## 🔄 Threat Lifecycle (Sequence Workflow)

```mermaid
sequenceDiagram
    autonumber
    actor Hacker as 🥷 Attacker
    participant WAF as 🛡️ Go Edge WAF
    participant Target as 📦 Target App
    participant Cloud as 🧠 Python SECaaS Cloud
    participant DB as 🗄️ PostgreSQL Vault
    participant React as 💻 React Dashboard
    participant Discord as 💬 Discord (Webhook)

    Hacker->>WAF: POST /login?user=<script>alert()</script>
    activate WAF
    WAF->>WAF: Payload Inspection (Regex Engine)
    WAF-->>Hacker: 403 Forbidden
    
    WAF->>Cloud: POST /waf/logs (Telemetry)
    deactivate WAF
    
    activate Cloud
    Cloud->>DB: Validate API Key
    DB-->>Cloud: Valid
    Cloud->>DB: Insert Threat Log
    
    par Async Alerting
        Cloud->>Discord: Webhook Alert
    end
    
    Cloud-->>React: Updated Threat Data
    deactivate Cloud
```

---

## 🗺️ System Topology

```mermaid
graph TD
    Admin([SOC Admin])
    Attacker([Malicious Actor])
    User([Legitimate User])

    subgraph Cloud
        UI[React Dashboard]
        API[FastAPI Backend]
        DB[(PostgreSQL)]
    end

    subgraph Customer
        WAF[Go Edge WAF]
        App[Target App]
    end

    Discord[Discord Webhooks]
    GeoIP[Geo-IP Provider]

    Admin --> UI
    UI --> API
    API --> DB
    API --> Discord
    API --> GeoIP

    Attacker --> WAF
    User --> WAF

    WAF --> App
    WAF --> API
```

---

## 📖 Deployment Workflow

1. **Register Target**

   * Add your application URL in the dashboard

2. **Generate API Key**

   * Securely copy the issued `WG_API_KEY`

3. **Deploy WAF Agent**

   * Run the Golang container with:

     * Target URL
     * API Key

4. **Validate Protection**

   * Simulate an attack:

     ```
     http://localhost:8080/?q=<script>
     ```
   * Confirm:

     * Request blocked
     * Logs appear in dashboard

---

## 🧠 Engineering Highlights

* Fully containerized microservices architecture
* Real-time distributed telemetry pipeline
* Secure multi-tenant SaaS design
* Edge-first security enforcement
* DevSecOps-ready alerting system

---

## 📌 Use Cases

* SaaS platform protection
* API gateway security layer
* DevSecOps monitoring pipelines
* Enterprise perimeter defense simulation
* Security research & demonstration

---

## 🏁 Conclusion

**WolfGuard 360** is engineered to demonstrate **production-grade DevSecOps practices**, combining **edge security enforcement**, **cloud intelligence**, and **real-time observability** into a cohesive, scalable platform.

---
