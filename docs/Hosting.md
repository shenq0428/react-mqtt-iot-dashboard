# Hosting

## Overview

NovaLobster HRMS is currently deployed on a cloud-based infrastructure using AWS and Neon PostgreSQL.

The goal of this deployment is to simulate a real-world production environment while keeping infrastructure costs affordable for personal development and portfolio purposes.

---

# Infrastructure

```text
Internet
        │
        ▼
novalobster.app
        │
        ▼
Cloudflare DNS
        │
        ▼
AWS EC2 (Ubuntu)
        │
        ▼
Nginx
        │
        ▼
Express.js Backend
        │
        ▼
Neon PostgreSQL
```

Frontend is served through Nginx.

Backend runs with PM2.

Database is hosted on Neon PostgreSQL.

---

# Hosting Services

| Service         | Provider        | Purpose                 |
| --------------- | --------------- | ----------------------- |
| Domain          | novalobster.app | Public website domain   |
| DNS             | Cloudflare      | DNS management & SSL    |
| Server          | AWS EC2 Ubuntu  | React + Express hosting |
| Process Manager | PM2             | Keep backend running    |
| Reverse Proxy   | Nginx           | HTTPS & Reverse Proxy   |
| Database        | Neon PostgreSQL | Cloud Database          |

---

# Estimated Cost

| Service                  | Cost                           |
| ------------------------ | ------------------------------ |
| Domain (novalobster.app) | RM 60–80 / year                |
| AWS EC2 Instance         | Approximately RM 35–45 / month |
| Neon PostgreSQL          | Free Tier                      |
| Cloudflare DNS           | Free                           |
| PM2                      | Free                           |
| Nginx                    | Free                           |
| Let's Encrypt SSL        | Free                           |

---

# Estimated Monthly Cost

Approximately

**RM 35–45 / month**

---

# Estimated Annual Cost

Approximately

**RM 480–620 / year**

(including domain renewal)

---

# Future Infrastructure

Planned upgrades include:

* Amazon S3 (Leave & Claim Attachments)
* CloudFront CDN
* Amazon SES (Email Notifications)
* Docker
* GitHub Actions CI/CD
* Amazon RDS PostgreSQL (Production)
* Application Load Balancer
* Auto Scaling Group

These services will be introduced as NovaLobster evolves from a personal portfolio project into a production-ready HR Management System.
