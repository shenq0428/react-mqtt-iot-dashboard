# NovaLobster System Design v2

---

# 15. PostgreSQL Database ERD

## Database Relationship Diagram

```text
┌──────────────┐
│ companies    │
├──────────────┤
│ id (PK)      │
│ company_name │
└──────┬───────┘
       │
       │ 1
       │
       │
       │ N
       ▼

┌──────────────┐
│ users        │
├──────────────┤
│ id (PK)      │
│ username     │
│ email        │
│ password     │
│ role         │
│ company_id   │── FK
└──────┬───────┘
       │
       │ 1
       │
       │
       │ N
       ▼

┌──────────────┐
│ audit_logs   │
├──────────────┤
│ id (PK)      │
│ actor_user_id│
│ action       │
│ target_id    │
│ description  │
└──────────────┘
```

---

# Why Normalization Exists

Bad:

```text
users

company_name

company_name

company_name
```

Repeated many times.

---

Good:

```text
users.company_id
↓
companies.id
```

Single source of truth.

---

# 16. Role Permission Matrix

## Current Architecture

| Action          | User | Admin | Superadmin |
| --------------- | ---- | ----- | ---------- |
| View Dashboard  | ✅    | ✅     | ✅          |
| View Users      | ❌    | ✅     | ✅          |
| Edit User       | ❌    | ✅     | ✅          |
| Activate User   | ❌    | ✅     | ✅          |
| Deactivate User | ❌    | ✅     | ✅          |
| Create User     | ❌    | ❌     | ✅          |
| Delete User     | ❌    | ❌     | ✅          |
| Change Role     | ❌    | ❌     | ✅          |
| View Audit Logs | ❌    | ❌     | ✅          |

---

# Future Company Superadmin

| Action                 | Company Superadmin |
| ---------------------- | ------------------ |
| View Company Users     | ✅                  |
| Create Company Users   | ✅                  |
| Delete Company Users   | ✅                  |
| Manage Other Companies | ❌                  |
| View Global Audit Logs | ❌                  |

---

# Permission Evaluation Flow

```text
Request
   │
   ▼
verifyToken
   │
   ▼
req.user.role
   │
   ▼
Role Matrix
   │
   ▼
Allow / Deny
```

---

# 17. Authentication Architecture

## Login Flow

```text
User
 │
 ▼
Email + Password
 │
 ▼
loginUser()
 │
 ▼
PostgreSQL
 │
 ▼
bcrypt.compare()
 │
 ▼
jwt.sign()
 │
 ▼
JWT
 │
 ▼
Frontend
```

---

## Request Flow

```text
JWT
 │
 ▼
Authorization Header
 │
 ▼
verifyToken
 │
 ▼
req.user
 │
 ▼
Controller
```

---

## Logout Flow

```text
Current Design

Remove Token
↓
Remove User
↓
Redirect Login
```

---

## Limitation

```text
JWT Expired
↓
verifyToken Fails
↓
Cannot Audit Logout
```

Future:

```text
Session Based Auth
```

solves this problem.

---

# 18. Audit Log Architecture

## Purpose

Track everything important.

---

## Audit Log Lifecycle

```text
User Action
     │
     ▼
Controller
     │
     ▼
createAuditLog()
     │
     ▼
audit_logs table
```

---

## Example

Create User

```text
CREATE_USER
```

Delete User

```text
DELETE_USER
```

Login

```text
LOGIN_SUCCESS
LOGIN_FAILED
```

---

## Audit Log Structure

```text
Actor
 │
 ▼
Action
 │
 ▼
Target
 │
 ▼
Description
 │
 ▼
Timestamp
```

---

# 19. MQTT Architecture

## MQTT Overview

```text
Publisher
   │
   ▼
Broker
   │
   ▼
Subscriber
```

---

## Nova Lobster

```text
Energy Meter
     │
     ▼
EMQX
     │
     ▼
Node.js
     │
     ▼
React Dashboard
```

---

## Topic Structure

```text
factory/blower1

factory/blower2

factory/energy

factory/temperature
```

---

## MQTT Data Flow

```text
Sensor
 │
 ▼
MQTT Publish
 │
 ▼
EMQX Broker
 │
 ▼
Subscriber
 │
 ▼
React State
 │
 ▼
Live Chart
```

---

# 20. InfluxDB Architecture

## Why InfluxDB

PostgreSQL

```text
Users
Roles
Companies
Audit Logs
```

---

InfluxDB

```text
Energy
Temperature
Pressure
Voltage
```

---

## Data Structure

```text
Measurement
│
├─ Tags
│
├─ Fields
│
└─ Timestamp
```

---

## Example

```text
Measurement

energy
```

Tags

```text
machine=blower1
```

Fields

```text
kwh=123.45
```

Timestamp

```text
2026-06-07
```

---

# 21. Dashboard Data Architecture

## Real-Time Chart

```text
MQTT
 │
 ▼
React State
 │
 ▼
Chart
```

---

## Historical Chart

```text
InfluxDB
 │
 ▼
Query
 │
 ▼
Chart
```

---

## Dashboard Flow

```text
Live Data
 ↓
Current State

Historical Data
 ↓
Analytics
```

---

# 22. AWS Production Architecture

```text
Internet
    │
    ▼
Domain
    │
    ▼
HTTPS
    │
    ▼
Nginx
    │
    ▼
PM2
    │
    ▼
Node.js API
    │
    ▼
PostgreSQL
```

---

## Frontend Deployment

```text
React Build
 │
 ▼
Nginx Static Files
```

---

## Backend Deployment

```text
Express
 │
 ▼
PM2
 │
 ▼
Auto Restart
```

---

# 23. Complete Nova Lobster Production Architecture

```text
┌───────────────────────┐
│ React Frontend        │
└──────────┬────────────┘
           │ Axios
           ▼

┌───────────────────────┐
│ Express Backend       │
└───────┬───────┬───────┘
        │       │
        ▼       ▼

 PostgreSQL   MQTT

        │       │
        │       ▼

        │     EMQX

        │       │

        │       ▼

        │   InfluxDB

        │       │

        ▼       ▼

 Audit Logs  Historical Charts
```

---

# Interview One-Minute Architecture Explanation

```text
Nova Lobster is a React + Express IoT Dashboard.

Frontend uses React, Context API and Protected Routes.

Backend uses Express, JWT Authentication, RBAC Authorization and Audit Logging.

User and company data are stored in PostgreSQL.

Real-time machine telemetry arrives through MQTT via EMQX.

Historical telemetry is stored in InfluxDB for time-series visualization.

The system is designed to support future multi-tenant Company Superadmin architecture and AWS deployment.
```
