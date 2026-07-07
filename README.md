# 🚀 Nova Lobster — React MQTT IoT Dashboard & HRMS

A full-stack web application originally built as a custom IoT dashboard to replace Grafana-style monitoring for device telemetry. It later expanded with authentication, role-based access control, company/user management, audit logging, and a small HRMS leave-request workflow.

This README documents the current architecture so future me can understand how the frontend, backend, databases, authentication, realtime data flow, and business modules fit together.

---

## ✨ Main Features

### IoT Dashboard

* Real-time MQTT telemetry monitoring
* Live frontend updates through Socket.IO
* Historical telemetry charts using InfluxDB
* Device data visualization with React and Recharts
* Dashboard pages, charts, alarm/threshold-related views, and test pages

### Authentication and Authorization

* JWT login flow
* Password hashing with bcrypt
* Backend-protected routes
* Role-based access control:

  * `user`
  * `admin`
  * `superadmin`

### HRMS Features

* Company management
* User management
* Create, edit, deactivate, and delete user accounts
* Temporary and permanent account types
* Leave request workflow:

  * Create leave request
  * View own leave requests
  * Edit pending request
  * Cancel pending request
  * Admin approve or reject leave request
  * Rejection reason required for rejected requests
  * `reviewed_by` and `reviewed_at` tracking

### Audit Log

Tracks important actions such as:

* Successful and failed logins
* User creation, update, deletion, and status changes
* Important administrative actions

Audit log records include actor information, action, target, description, IP address, user agent, company, and timestamp.

---

# 🧱 Tech Stack

| Area                 | Technology                        |
| -------------------- | --------------------------------- |
| Frontend             | React, Vite, React Router, Axios  |
| Charts               | Recharts                          |
| Backend              | Node.js, Express                  |
| Authentication       | JWT, bcrypt                       |
| Relational Database  | PostgreSQL / Neon PostgreSQL      |
| Time-Series Database | InfluxDB                          |
| Messaging            | MQTT / Mosquitto                  |
| Realtime Updates     | Socket.IO                         |
| Deployment           | AWS EC2, PM2, GitHub Actions, SSH |
| Version Control      | Git and GitHub                    |

---

# 📡 High-Level Architecture

## 1. IoT Telemetry Flow

```text
Device / Fake Publisher
        ↓
MQTT Broker (Mosquitto)
        ↓
Node.js Express Backend
        ↓
 ┌───────────────┬─────────────────┐
 ↓               ↓
InfluxDB       Socket.IO
 ↓               ↓
Historical      React Dashboard
Charts          Live UI Updates
```

The backend subscribes to MQTT telemetry messages.

For each incoming message, it can:

1. Parse the device payload.
2. Store historical telemetry in InfluxDB.
3. Emit a Socket.IO event to connected frontend clients.
4. Allow React charts and dashboard cards to update without refreshing the page.

Typical telemetry fields include:

```text
motor_amp
power
energy_consumption
run_status
```

Typical InfluxDB tags include:

```text
site
equipment
type
```

---

## 2. HRMS Request Flow

```text
React Frontend
        ↓
Axios HTTP Request
        ↓
Express Route
        ↓
Middleware
verifyToken / requireRole
        ↓
Controller
        ↓
Service
        ↓
Repository
        ↓
PostgreSQL
        ↓
JSON Response to Frontend
```

Example:

```text
Frontend clicks "Approve Leave Request"
        ↓
PATCH /api/leave-requests/:id/status
        ↓
verifyToken checks JWT
        ↓
requireRole("admin") checks permission
        ↓
Controller reads req.params and req.body
        ↓
Service validates business rules
        ↓
Repository updates PostgreSQL
        ↓
Controller returns JSON response
```

---

# 🗂️ Project Structure

```text
frontend/
  src/
    components/        Reusable UI components
    pages/             Route-level pages
    context/           Authentication and shared state
    services/          API-related frontend helpers
    App.jsx            Main application routes

backend/
  config/
    db.js              PostgreSQL connection

  controllers/
    authController.js
    userController.js
    companyController.js
    leaveRequestController.js
    auditController.js

  services/
    userService.js
    auditLogService.js
    leaveRequestService.js

  repositories/
    userRepository.js
    auditLogRepository.js
    leaveRequestRepository.js

  routes/
    authRoutes.js
    userRoutes.js
    companyRoutes.js
    leaveRequestRoutes.js
    auditRoutes.js

  middleware/
    authMiddleware.js
    roleMiddleware.js

  utils/
    auditLogger.js

  migrations/
    PostgreSQL schema migrations

  server.js

.env.example
README.md
```

---

# 🧭 Backend Architecture

The backend originally used this structure:

```text
Route → Controller → PostgreSQL
```

As the project grew, larger business modules were refactored toward:

```text
Route → Controller → Service → Repository → PostgreSQL
```

## Responsibilities by Layer

| Layer      | Responsibility                                         |
| ---------- | ------------------------------------------------------ |
| Route      | Defines endpoint, HTTP method, and middleware          |
| Middleware | Verifies JWT and checks roles                          |
| Controller | Handles `req` and `res` only                           |
| Service    | Business rules, validation, permission logic, workflow |
| Repository | PostgreSQL SQL queries only                            |
| Utility    | Shared helpers such as audit logging                   |

### Example

```text
POST /api/users
        ↓
userRoutes.js
        ↓
verifyToken + requireRole(...)
        ↓
userController.createUser()
        ↓
userService.createUser()
        ↓
userRepository.insertUser()
        ↓
PostgreSQL
```

The reason for this separation is to avoid one large controller containing:

```text
HTTP handling
+ validation
+ permissions
+ bcrypt
+ SQL
+ audit logs
+ response formatting
```

---

# 🔐 Authentication and Roles

## JWT Flow

```text
User submits login form
        ↓
Backend checks email and password hash
        ↓
Backend creates JWT
        ↓
Frontend stores token
        ↓
Frontend sends token in later API requests
        ↓
verifyToken middleware decodes JWT
        ↓
req.user becomes available
```

Example `req.user` shape:

```js
req.user = {
    id: decoded.id,
    username: decoded.username,
    role: decoded.role,
    company_id: decoded.company_id
};
```

## Roles

### `user`

* Can use their own account
* Can create leave requests
* Can view, edit, or cancel only their own pending leave requests

### `admin`

* Can manage users within their company
* Can view leave requests for their company
* Can approve or reject leave requests from their company

### `superadmin`

* Can manage companies
* Can create and manage admin/user accounts
* Can view administrative information such as audit logs

> Intentional scope: superadmin does not participate in the Leave Request workflow.

---

# 🗃️ Database Design

## PostgreSQL

PostgreSQL stores relational business data:

```text
companies
users
leave_requests
audit_logs
```

Basic relationships:

```text
companies
    ↓ 1-to-many
users
    ↓ 1-to-many
leave_requests

users
    ↓ 1-to-many
audit_logs
```

Important fields include:

```text
users:
- id
- username
- email
- password_hash
- role
- company_id
- privilege_type
- expires_at
- status

leave_requests:
- id
- request_number
- user_id
- company_id
- leave_type
- start_date
- end_date
- reason
- status
- reviewed_by
- reviewed_at
- rejected_reason
- cancelled_at

audit_logs:
- actor_user_id
- actor_username
- actor_role
- company_id
- action
- target_type
- target_id
- description
- ip_address
- user_agent
- location
- created_at
```

## InfluxDB

InfluxDB stores telemetry and time-series data.

Use PostgreSQL for:

```text
users
roles
companies
leave requests
audit logs
```

Use InfluxDB for:

```text
sensor readings
power usage
motor current
energy consumption
device runtime history
```

---

# 🌐 API Modules

The route files are the source of truth for exact endpoints. Main API modules include:

```text
/api/auth
/api/users
/api/companies
/api/leave-requests
/api/audit-logs
/api/history
/api/threshold
/api/alarm
```

Common HTTP methods used:

```text
GET     Read data
POST    Create data
PATCH   Update part of existing data
DELETE  Delete data
```

---

# 🧩 Frontend Architecture Notes

## React Router

The project originally used state-based page switching:

```js
const [page, setPage] = useState("dashboard");
```

This was replaced with React Router.

Current routing concepts:

```text
BrowserRouter
Routes
Route
Link
useLocation
```

Benefits:

```text
Real URLs
Browser back/forward works
Bookmarkable pages
Refresh keeps current route
Better scaling for more pages
```

## Pages vs Components

### `pages/`

Route-level pages.

Examples:

```text
DashboardOverview
UserManagement
AuditLogs
Leave Request pages
MQTTPage
Settings
```

### `components/`

Reusable UI and feature components.

Examples:

```text
Sidebar
Charts
Tables
Cards
Forms
Alarm components
```

## Active Sidebar Route

The sidebar uses:

```js
useLocation();
location.pathname;
```

to determine the active route and apply active CSS styling.

---

# ⚙️ Local Development Setup

## 1. Clone Repository

```bash
git clone <repository-url>
cd react-mqtt-iot-dashboard
```

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

## 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 4. Configure Environment Variables

Create backend environment variables based on `.env.example`.

Example backend values:

```env
PORT=3001
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret

MQTT_URL=your_mqtt_connection_url

INFLUX_URL=your_influx_url
INFLUX_TOKEN=your_influx_token
INFLUX_ORG=your_influx_org
INFLUX_BUCKET=your_influx_bucket
```

Example frontend values:

```env
VITE_API_URL=http://localhost:3001
```

Never commit real secrets, database URLs, API tokens, or private keys.

## 5. Run Backend

```bash
cd backend
npm run dev
```

## 6. Run Frontend

```bash
cd frontend
npm run dev
```

Typical local development URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3001
```

---

# 🚀 Deployment Notes

Production deployment uses:

```text
GitHub Push
        ↓
GitHub Actions
        ↓
SSH into EC2
        ↓
Pull latest code
        ↓
Install dependencies if needed
        ↓
Restart backend with PM2
```

Important production checks after changing backend code:

```text
1. Check environment variables exist on EC2.
2. Check PostgreSQL migrations were applied.
3. Check PM2 backend process is online.
4. Check frontend VITE_API_URL points to the correct backend domain.
5. Check CORS configuration.
6. Check MQTT and InfluxDB credentials if realtime data stops.
```

Useful PM2 commands:

```bash
pm2 status
pm2 logs backend
pm2 restart backend
```

---

# 🧪 Important Debugging Notes

## Login Works Locally but Fails in Production

Check:

```text
DATABASE_URL
JWT_SECRET
database migration status
production environment variables
backend PM2 logs
```

## Audit Log Error: `... is not a function`

Check that the service exports both functions:

```js
module.exports = {
    getAuditLogs,
    createAuditLog
};
```

Then confirm the import path is correct:

```js
const auditLogService = require(
    "../services/auditLogService"
);
```

## Frontend Cannot Reach Backend

Check:

```text
VITE_API_URL
CORS settings
backend server port
domain / reverse proxy configuration
browser network tab
```

## User Gets 403 Forbidden

Check:

```text
JWT token exists
verifyToken middleware ran
req.user.role value
requireRole(...) rule
company_id scope rule
```

## IoT Dashboard Does Not Update

Check the full data path:

```text
Device / Fake Publisher
→ MQTT Broker
→ Backend MQTT subscription
→ InfluxDB write
→ Socket.IO emit
→ Frontend Socket.IO connection
```

---

# 📘 What This Project Practiced

This project was used to practice:

```text
React and Vite
React Router
Axios API calls
Node.js and Express
REST APIs
JWT authentication
bcrypt password hashing
Role-based authorization
PostgreSQL SQL queries
Parameterized queries
JOIN, INSERT, UPDATE, DELETE, RETURNING
InfluxDB time-series data
MQTT messaging
Socket.IO realtime updates
Audit logging
Role-based workflow design
Service and Repository pattern
Git and GitHub
GitHub Actions CI/CD
AWS EC2
PM2
Production debugging
```

---

# ⚠️ Project Rules for Future Changes

1. Do not put secrets in GitHub.
2. Keep SQL parameterized with `$1`, `$2`, and so on.
3. Do not trust frontend role checks alone; backend middleware and service rules are the real protection.
4. Keep new backend business modules organized as:

```text
Route → Controller → Service → Repository
```

5. Apply PostgreSQL migrations before relying on new columns or tables in production.
6. Test locally before pushing production changes.
7. Use clear commits:

```text
feat: add new feature
fix: fix bug
refactor: improve structure without changing behaviour
chore: maintenance or cleanup
docs: update documentation
```

---

# ✅ Current Project Scope

This project is considered a completed learning and portfolio project.

The main focus was not only making screens work, but understanding how a real full-stack application connects:

```text
Frontend
→ API
→ Authentication
→ Authorization
→ Business Rules
→ Database
→ Realtime Messaging
→ Deployment
```

Future work should only be added when there is a clear learning goal, not just to make the project bigger.
