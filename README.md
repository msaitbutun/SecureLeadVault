# 🛡️ SecureLeadVault: DevSecOps-Ready CRM

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![Security](https://img.shields.io/badge/security-hardened-red)

**SecureLeadVault**, modern **DevSecOps** prensiplerini (Shift-Left Security) göstermek amacıyla geliştirilmiş; konteynerize edilmiş, güvenliği sıkılaştırılmış ve CI/CD süreçlerine entegre edilmiş bir MERN Stack uygulamasıdır.

---

## 🏗️ Mimari ve Akış (Architecture)

Proje, 3 katmanlı (3-Tier) mimari üzerine kuruludur ve tüm bileşenler Docker Compose ile orkestre edilir.

```mermaid
graph TD;
    User-->|HTTP/HTTPS| Nginx_Frontend;
    Nginx_Frontend-->|API Requests| Node_Backend;
    Node_Backend-->|Read/Write| MongoDB;
    
    subgraph Docker Network
    Nginx_Frontend[React + Vite (Nginx)]
    Node_Backend[Express API (Hardened)]
    MongoDB[(MongoDB Database)]
    end