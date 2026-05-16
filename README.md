# 🚀 React MQTT IoT Dashboard

A custom IoT dashboard built with React, Node.js, and MQTT to replace Grafana for real-time monitoring and device control.

---

## 🧱 Tech Stack

* Frontend: React (Vite)
* Backend: Node.js (Express)
* Messaging: MQTT
* Database: (Planned - PostgreSQL for login authentication * authorizaiton in future, influxdb for timeseries data for grapchart future)

---

## 📡 Architecture

React → Node.js → MQTT Broker → Device

---

## 🗂️ Project Structure

```
frontend/
backend/
.env.example
README.md
```

---

## 🧭 Development Phases

### 🥚 Phase 1: UI Dashboard

* [ ] Dashboard layout (cards)
* [ ] Control buttons (UI only)
* [ ] Mock data display

### 🐣 Phase 2: API Integration

* [ ] Connect frontend → backend
* [ ] Implement /control endpoint

### 🐥 Phase 3: MQTT Integration

* [ ] Publish control message
* [ ] Subscribe to device data

### 🐤 Phase 4: Real-time Updates

* [ ] WebSocket / Socket.io
* [ ] Live UI update

### 🦅 Phase 5: Database

* [ ] Store sensor data
* [ ] Historical charts

---

## 📘 Development Diary

See `diary.md` for progress logs.

---
# Frontend Architecture Notes

## 1. Old Navigation System

Previously the app used:

- useState(page)
- setPage()
- if(page === "...")

This is called state-based rendering.

Problems:
- no real URL
- refresh loses current page
- browser back button does not work
- not scalable

---

## 2. React Router Migration

Now the app uses:

- BrowserRouter
- Routes
- Route
- Link

Navigation is now URL-based.

Benefits:
- real URLs
- browser history works
- scalable
- bookmarkable pages

---

## 3. Pages vs Components

### pages/

Used for route-level pages.

Examples:
- Settings
- DashboardLayout
- MQTTPage

### components/

Used for reusable UI/features.

Examples:
- Sidebar
- MQTTGraphChart
- AlarmTable

---

## 4. Nested Routing

Dashboard routes are grouped inside DashboardLayout.

App.jsx only manages top-level routes.

DashboardLayout manages dashboard internal routes.

Example:
- /dashboard/testing
- /dashboard/mqtt-graphchart

---

## 5. Active Route Highlighting

Sidebar uses:

- useLocation()
- location.pathname

to detect current route and apply active CSS classes.

## ⚠️ Rules (for myself)

* Build phase by phase
* Do not jump ahead
* Commit properly:

  * feat: new feature
  * fix: bug fix
  * chore: cleanup
