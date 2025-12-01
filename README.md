
# 🛡️ SecureLeadVault: Enterprise Grade DevSecOps CRM

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/containerized-docker-blue)
![Security](https://img.shields.io/badge/security-hardened-red)
![Coverage](https://img.shields.io/badge/tests-passing-success)

**SecureLeadVault** is an end-to-end secure, containerized MERN Stack application developed with modern **DevSecOps** principles (Shift-Left Security) and automated testing processes.

This project is not just a CRM application, but a "Case Study" demonstrating **Test-Driven (TDD)** and **Secure-by-Design** architectural approaches.

---

## 🏗️ System Architecture

The project runs on isolated Docker containers, suitable for transitioning to a microservices architecture.

```mermaid
graph TD;
    User((User)) -->|HTTP/HTTPS| Frontend["React + Vite (Nginx)"];
    Frontend -->|REST API| Backend["Node.js + Express"];
    Backend -->|Read/Write| DB[(MongoDB)];
    
    subgraph "Docker Network"
    Frontend
    Backend
    DB
    end
````

-----

## 🚀 Key Features

### 🛡️ Security (DevSecOps)

  * **Role-Based Access Control (RBAC):** Unauthorized access is prevented by simulating `Sales Rep` and `Manager` roles.
  * **Container Hardening:** Docker images are optimized, and non-root user principles are applied.
  * **Security Headers:** HTTP header security is enforced using the `Helmet` library.
  * **Attack Surface Reduction:** Unnecessary ports are closed; only the API Gateway (Nginx) is exposed.

### ⚙️ DevOps & Automation

  * **Multi-Stage Docker Builds:** Frontend image size reduced from 1GB to **20MB** (Alpine Linux optimization).
  * **Jenkins CI/CD Pipeline:**
      * 🧪 **Automated Testing:** Automatic API tests via Jest and Supertest after every commit.
      * 🔍 **SAST & Vulnerability Scanning:** Dependency and image scanning (Trivy integration).

### 💻 Tech Stack

  * **Frontend:** React 18, Vite, CSS3 (Modern Dashboard UI)
  * **Backend:** Node.js, Express, Mongoose
  * **Database:** MongoDB v6
  * **DevOps Tools:** Docker, Docker Compose, Jenkins, Trivy

-----

## 📸 Project Screenshots

### 1\. Secure Dashboard & UI

Modern and user-friendly interface. Includes role-based permission alerts.

<img width="2866" height="1701" alt="image" src="https://github.com/user-attachments/assets/186e1be7-0b83-4755-b140-084be6c3caf7" />

### 2\. Jenkins Pipeline Success

Automated process where Test, Security Scan, and Build stages were completed successfully.

<img width="2765" height="811" alt="image" src="https://github.com/user-attachments/assets/61bb8c2f-c671-43ad-8573-4d30ab446d69" />

-----

## 🛠️ Installation

To run the project locally, **you do not need Node.js installed.** Docker is sufficient.

```bash
# 1. Clone the repo
git clone [https://github.com/msaitbutun/SecureLeadVault.git](https://github.com/msaitbutun/SecureLeadVault.git)
cd SecureLeadVault

# 2. Start the system (including Build)
docker-compose up -d --build

# 3. Access services
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Jenkins CI: http://localhost:8080
```

-----

## 🧪 Testing Processes

Backend tests run inside the Docker container in an isolated environment. Database connection is handled via **Mocking**, eliminating external dependencies.

To run tests manually:

```bash
docker exec secure-backend npm test
```

-----

**Developed by Muhammed Sait Bütün**

