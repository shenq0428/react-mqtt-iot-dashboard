# Nova Lobster Dashboard Architecture Diagram

---

# 1. High Level System Architecture

```text
┌─────────────┐
│ React Frontend │
└──────┬──────┘
       │ Axios
       ▼
┌─────────────┐
│ Express API │
└──────┬──────┘
       │
 ┌─────┴─────┐
 ▼           ▼
PostgreSQL   MQTT Broker
(Database)   (EMQX)
```

---

# 2. Authentication Flow

```text
User
 │
 │ Email + Password
 ▼
Login Page
 │
 ▼
POST /api/auth/login
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
JWT Token
 │
 ▼
localStorage
 │
 ▼
AuthContext
 │
 ▼
Dashboard
```

---

# 3. Protected Route Flow

```text
User Visit Route
        │
        ▼
ProtectedRoute
        │
        ▼
AuthContext
        │
        ▼
User Exists ?
   │       │
   │Yes    │No
   ▼       ▼
Page     Login
```

---

# 4. Backend Request Flow

```text
Frontend
   │
   ▼
Route
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
PostgreSQL
   │
   ▼
Response
   │
   ▼
Frontend
```

Example:

```text
PATCH /users/15
      │
      ▼
verifyToken
      │
      ▼
checkAdmin
      │
      ▼
updateUser()
      │
      ▼
users table
```

---

# 5. JWT Verification Flow

```text
Request
 │
 ▼
Authorization Header
 │
 ▼
verifyToken()
 │
 ▼
jwt.verify()
 │
 ▼
Decode Payload
 │
 ▼
req.user
 │
 ▼
Controller
```

Example:

```js
req.user.id

req.user.role

req.user.username
```

---

# 6. RBAC Permission Flow

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
Permission Check
 │
 ├─────────────┐
 ▼             ▼
Allow        Reject
```

Roles:

```text
User
│
├─ View Dashboard

Admin
│
├─ Manage Users

Superadmin
│
├─ Create User
├─ Delete User
└─ Change Role
```

---

# 7. User Management Flow

```text
User Click Update
        │
        ▼
Edit Form
        │
        ▼
PATCH Request
        │
        ▼
updateUser()
        │
        ▼
Database Update
        │
        ▼
Audit Log
        │
        ▼
Response
```

---

# 8. Audit Log Flow

```text
Action
 │
 ▼
Controller
 │
 ▼
createAuditLog()
 │
 ▼
audit_logs
```

Actions:

```text
CREATE_USER

UPDATE_USER

UPDATE_USER_STATUS

DELETE_USER

LOGIN_SUCCESS

LOGIN_FAILED

LOGOUT
```

---

# 9. MQTT Real-Time Flow

```text
Sensor
 │
 ▼
Publisher
 │
 ▼
EMQX Broker
 │
 ▼
Subscriber
 │
 ▼
React Dashboard
 │
 ▼
Live Chart
```

Example:

```text
factory/blower1
factory/blower2
factory/energy
```

---

# 10. Historical Data Flow

```text
MQTT Data
 │
 ▼
Node.js Collector
 │
 ▼
InfluxDB
 │
 ▼
Query
 │
 ▼
Historical Chart
```

---

# 11. React State Flow

```text
API
 │
 ▼
useEffect()
 │
 ▼
setUsers()
 │
 ▼
users State
 │
 ▼
users.map()
 │
 ▼
Table UI
```

---

# 12. AuthContext Flow

```text
Login
 │
 ▼
getCurrentUser()
 │
 ▼
AuthContext
 │
 ▼
All Components
```

Components Using AuthContext:

```text
Navbar

ProtectedRoute

Logout

UserManagement
```

---

# 13. AWS Deployment Architecture

```text
Internet
    │
    ▼
Domain
    │
    ▼
Nginx
    │
    ▼
PM2
    │
    ▼
Express API
    │
    ▼
PostgreSQL
```

Frontend:

```text
React Build
     │
     ▼
Nginx Static Hosting
```

---

# 14. Complete Nova Lobster Architecture

```text
┌──────────────────┐
│ React Frontend   │
└────────┬─────────┘
         │ Axios
         ▼
┌──────────────────┐
│ Express Backend  │
└───────┬──────────┘
        │
 ┌──────┼───────────┐
 ▼      ▼           ▼

Users  AuditLogs   MQTT

 ▼      ▼           ▼

PostgreSQL       EMQX

                  │
                  ▼

               InfluxDB

                  │
                  ▼

          Historical Charts
```
