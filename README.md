# 🚀 React MQTT IoT Dashboard

A custom IoT dashboard built with React, Node.js, and MQTT to replace Grafana for real-time monitoring and device control.

---

## 🧱 Tech Stack

* Frontend: React (Vite)
* Backend: Node.js (Express)
* Messaging: MQTT
* Database: (Planned - PostgreSQL)

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

## ⚠️ Rules (for myself)

* Build phase by phase
* Do not jump ahead
* Commit properly:

  * feat: new feature
  * fix: bug fix
  * chore: cleanup
