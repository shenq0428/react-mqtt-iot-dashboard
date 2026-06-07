# NovaLobster Cheat Sheet - Part 2

## 5. Authorization (RBAC)

### What

RBAC：

```text
Role Based Access Control
```

根据角色决定权限。

---

### Why

避免普通用户获得管理员权限。

---

### Roles

#### User

```text
View Dashboard

View Own Data
```

---

#### Admin

```text
View Users

Edit Users

Activate Users

Deactivate Users
```

---

#### Superadmin

```text
Create Users

Delete Users

Change Roles

Assign Companies
```

---

#### Company Superadmin (Future)

```text
Manage Company Users

Cannot Access Other Companies
```

---

### Permission Flow

```text
Request
↓
verifyToken
↓
req.user.role
↓
Check Permission
↓
Allow / Deny
```

---

## 6. Backend Architecture

### Express

#### What

Node.js Web Framework

---

#### Graph

```text
Request
↓
Express
↓
Response
```

---

### Routes

#### What

决定 URL 去哪里。

#### Nova Lobster

```js
router.post("/login")

router.get("/me")

router.patch("/users/:id")
```

---

#### Graph

```text
URL
↓
Route
↓
Controller
```

---

### Controllers

#### What

处理业务逻辑。

#### Nova Lobster

```js
loginUser()

registerUser()

updateUser()

deleteUser()
```

---

#### Graph

```text
Route
↓
Controller
↓
Database
```

---

### Middleware

#### What

请求进入 Controller 前先检查。

#### Nova Lobster

```js
verifyToken

checkAdmin
```

---

#### Graph

```text
Request
↓
Middleware
↓
Controller
```

---

### Services

#### What

专门负责逻辑。

未来项目会大量使用。

---

### Utils

#### What

辅助工具。

#### Nova Lobster

```js
createAuditLog()
```

---

### Backend Request Flow

```text
Frontend
↓
Route
↓
Middleware
↓
Controller
↓
Database
↓
Response
```

---

## 7. Database Design

### PostgreSQL

#### What

关系型数据库。

---

### PK (Primary Key)

#### What

唯一 ID。

```text
users.id
```

---

### FK (Foreign Key)

#### What

连接其他 Table。

#### Example

```text
users.company_id
↓
companies.id
```

---

### JOIN

#### What

组合多个 Table。

#### Nova Lobster

```sql
users
JOIN
companies
```

---

#### Graph

```text
Users
↓
company_id
↓
Companies
```

---

### Normalization

#### What

避免重复资料。

---

#### Bad

```text
user_company_name
```

重复存很多次。

---

#### Good

```text
users
↓
company_id
↓
companies
```

---

### SQL Injection

#### What

攻击者插入恶意 SQL。

---

#### Dangerous

```js
"SELECT * FROM users
WHERE email='" + email + "'"
```

---

### Parameterized Query

#### What

防止 SQL Injection。

#### Nova Lobster

```js
WHERE email = $1
```

---

#### Graph

```text
Input
↓
Parameter
↓
Database
```

---

## 8. User Management

### Create User

```text
Form
↓
POST
↓
Database
↓
Audit Log
```

---

### Update User

```text
Edit
↓
PATCH
↓
Database
↓
Audit Log
```

---

### Delete User

```text
Delete
↓
Database
↓
Audit Log
```

---

### Status Management

#### Active

```text
Can Login
```

---

#### Deactivated

```text
Cannot Login
```

---

### Permission Rules

#### User

```text
No User Management
```

---

#### Admin

```text
Edit User
Activate User
Deactivate User
```

---

#### Superadmin

```text
Create User
Delete User
Change Role
```

---

## 9. Audit Logs

### Purpose

记录所有重要操作。

---

### Graph

```text
User Action
↓
Audit Log
↓
Database
```

---

### CREATE_USER

```text
New User Created
```

---

### UPDATE_USER

```text
Username

Email

Role

Company
```

---

### UPDATE_USER_STATUS

```text
Activated

Deactivated
```

---

### DELETE_USER

```text
User Deleted
```

---

### LOGIN_SUCCESS

```text
Successful Login
```

---

### LOGIN_FAILED

```text
Wrong Password

Email Not Found

Account Expired
```

---

### LOGOUT

```text
User Logged Out
```

---

### Audit Flow

```text
Action
↓
createAuditLog()
↓
audit_logs
```

---

## 10. IoT Architecture

### MQTT

#### What

轻量级 IoT 通讯协议。

---

### Broker

#### What

中间服务器。

#### Example

```text
EMQX
Mosquitto
```

---

### Publisher

#### What

发送数据。

#### Example

```text
Energy Meter
```

---

### Subscriber

#### What

接收数据。

#### Example

```text
Nova Lobster Dashboard
```

---

### Topic

#### What

MQTT 地址。

#### Example

```text
factory/blower1
```

---

### MQTT Flow

```text
Sensor
↓
Publisher
↓
Broker
↓
Subscriber
↓
Dashboard
```

---

## 11. Time Series (InfluxDB)

### What

专门存时间序列资料。

---

### Why Not PostgreSQL

PostgreSQL：

```text
User Data

Company Data

Transactions
```

---

InfluxDB：

```text
Sensor Data

Energy Data

Temperature Data
```

---

### Measurement

类似 Table。

#### Example

```text
energy
```

---

### Tags

用于过滤。

#### Example

```text
machine=blower1
```

---

### Fields

真正数值。

#### Example

```text
kwh=120.5
```

---

### Retention

自动删除旧资料。

---

### Graph

```text
Measurement
↓
Tags
↓
Fields
↓
Timestamp
```

---

## 12. Dashboard Design

### Real-time Charts

#### What

即时更新。

#### Graph

```text
MQTT
↓
React
↓
Chart
```

---

### Historical Charts

#### What

过去数据分析。

#### Graph

```text
InfluxDB
↓
Query
↓
Chart
```

---

### Time Series Visualization

#### What

时间 vs 数值。

#### Example

```text
Time
↓
Energy Usage
```

---

## 13. AWS Deployment

### EC2

云端服务器。

---

### Ubuntu

Linux 作业系统。

---

### SSH

远端连接服务器。

```bash
ssh ubuntu@ip
```

---

### PM2

保持 Backend 一直运行。

---

### Nginx

反向代理。

---

### HTTPS

SSL 加密。

---

### Domain

#### Example

```text
dashboard.novalobster.com
```

---

### Deployment Flow

```text
React
↓
EC2

Node.js
↓
PM2

Nginx
↓
HTTPS
↓
Domain
```

---

## 14. Interview Preparation

### Explain Architecture

```text
React
↓
Axios
↓
Express
↓
Middleware
↓
Controller
↓
PostgreSQL
↓
Audit Logs
```

---

### Explain JWT

```text
Login
↓
JWT
↓
Browser
↓
verifyToken
↓
req.user
```

---

### Explain RBAC

```text
User

Admin

Superadmin
```

---

### Explain Audit Logs

```text
Track All Critical Actions
```

---

### Explain MQTT

```text
Publisher
↓
Broker
↓
Subscriber
↓
Dashboard
```

---

# Nova Lobster Architecture Summary

```text
Frontend (React)
↓
Axios
↓
Backend (Express)
↓
Middleware
↓
Controllers
↓
PostgreSQL

Audit Logs
↓
audit_logs

MQTT
↓
EMQX
↓
Dashboard

InfluxDB
↓
Historical Charts
```
