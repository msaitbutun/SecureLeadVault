


# 🛡️ SecureLeadVault: Enterprise Grade DevSecOps CRM

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Docker](https://img.shields.io/badge/containerized-docker-blue)
![Security](https://img.shields.io/badge/security-hardened-red)
![Coverage](https://img.shields.io/badge/tests-passing-success)

**SecureLeadVault**, modern **DevSecOps** prensipleri (Shift-Left Security) ile geliştirilmiş; uçtan uca güvenli, konteynerize edilmiş ve otomatik test süreçlerine sahip bir MERN Stack uygulamasıdır.

Bu proje, sadece bir CRM uygulaması değil, **Test-Driven (TDD)** ve **Secure-by-Design** mimari yaklaşımının bir "Case Study"sidir.

---

## 🏗️ Sistem Mimarisi (Architecture)

Proje, mikroservis mimarisine geçişe uygun, izole edilmiş Docker konteynerleri üzerinde çalışır.

```mermaid
graph TD;
    User((Kullanıcı)) -->|HTTP/HTTPS| Frontend["React + Vite (Nginx)"];
    Frontend -->|REST API| Backend["Node.js + Express"];
    Backend -->|Read/Write| DB[(MongoDB)];
    
    subgraph "Docker Network"
    Frontend
    Backend
    DB
    end
````

-----

## 🚀 Temel Özellikler (Key Features)

### 🛡️ Güvenlik (DevSecOps)

  * **Role-Based Access Control (RBAC):** `Sales Rep` ve `Manager` rolleri simüle edilerek yetkisiz erişimler engellenmiştir.
  * **Container Hardening:** Docker imajları optimize edilmiş ve `root` olmayan kullanıcı prensipleri uygulanmıştır.
  * **Security Headers:** `Helmet` kütüphanesi ile HTTP başlık güvenliği sağlanmıştır.
  * **Attack Surface Reduction:** Gereksiz portlar kapatılmış, sadece API Gateway (Nginx) dışarıya açılmıştır.

### ⚙️ DevOps & Otomasyon

  * **Multi-Stage Docker Builds:** Frontend imaj boyutu 1GB'dan **20MB** seviyesine düşürülmüştür (Alpine Linux optimizasyonu).
  * **Jenkins CI/CD Pipeline:**
      * 🧪 **Automated Testing:** Jest ve Supertest ile her commit sonrası otomatik API testleri.
      * 🔍 **SAST & Vulnerability Scanning:** Bağımlılık ve imaj taramaları (Trivy entegrasyonu).

### 💻 Teknoloji Yığını (Tech Stack)

  * **Frontend:** React 18, Vite, CSS3 (Modern Dashboard UI)
  * **Backend:** Node.js, Express, Mongoose
  * **Database:** MongoDB v6
  * **DevOps Tools:** Docker, Docker Compose, Jenkins, Trivy

-----

## 📸 Proje Görselleri

### 1\. Güvenli Dashboard & UI

Modern ve kullanıcı dostu arayüz. Rol tabanlı yetki uyarılarını içerir.

<img width="2866" height="1701" alt="image" src="https://github.com/user-attachments/assets/186e1be7-0b83-4755-b140-084be6c3caf7" />


### 2\. Jenkins Pipeline Başarısı

Test, Güvenlik Taraması ve Build aşamalarının başarıyla tamamlandığı otomatik süreç.

<img width="2765" height="811" alt="image" src="https://github.com/user-attachments/assets/61bb8c2f-c671-43ad-8573-4d30ab446d69" />


-----

## 🛠️ Kurulum (Installation)

Projeyi yerel ortamınızda ayağa kaldırmak için **Node.js kurmanıza gerek yoktur.** Sadece Docker yeterlidir.

```bash
# 1. Repoyu klonlayın
git clone [https://github.com/msaitbutun/SecureLeadVault.git](https://github.com/msaitbutun/SecureLeadVault.git)
cd SecureLeadVault

# 2. Sistemi başlatın (Build dahil)
docker-compose up -d -f --build

# 3. Servislere erişin
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Jenkins CI: http://localhost:8080
```

-----

## 🧪 Test Süreçleri

Backend testleri, Docker konteyneri içinde izole bir ortamda çalıştırılır. Veritabanı bağlantısı **Mocking** (Simülasyon) yöntemiyle test edilerek dış bağımlılıklar ortadan kaldırılmıştır.

Manuel test etmek için:

```bash
docker exec secure-backend npm test
```

-----

**Developed by Muhammed Sait Bütün**



