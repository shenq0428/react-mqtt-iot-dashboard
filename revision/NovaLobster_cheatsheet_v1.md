# NovaLobster Cheat Sheet - Part 1

## 1. Programming Fundamentals

### Variables

#### What

存放资料的容器。

```js
const username = "pikachu";
```

#### Why

避免重复写相同资料。

#### Nova Lobster

```js
const token = localStorage.getItem("token");

const changes = [];

const oldUser = targetUser.rows[0];
```

#### Graph

```text
Data
↓
Variable
↓
Use Anywhere
```

---

### Functions

#### What

可重复使用的逻辑。

#### Why

避免复制相同代码。

#### Nova Lobster

```js
loginUser()

registerUser()

updateUser()

createAuditLog()
```

#### Graph

```text
Input
↓
Function
↓
Output
```

---

### Objects

#### What

把相关资料打包一起。

```js
{
  id: 1,
  username: "pikachu",
  role: "admin"
}
```

#### Nova Lobster

```js
req.user

editedUsers

currentUser
```

#### Graph

```text
User
│
├─ id
├─ username
└─ role
```

---

### Arrays

#### What

多个资料集合。

#### Nova Lobster

```js
users

logs

companies
```

#### Graph

```text
[
 user1,
 user2,
 user3
]
```

---

### Spread Operator

#### What

复制旧资料后修改部分内容。

```js
...object
```

#### Nova Lobster

```js
setEditedUsers({

 ...editedUsers,

 [user.id]:{
  ...editedUsers[user.id]
 }

})
```

#### Graph

```text
Old State
↓
Copy
↓
Modify
↓
New State
```

---

### Promise

#### What

未来才会得到的结果。

#### Graph

```text
Pending
↓
Resolved

or

Pending
↓
Rejected
```

#### Nova Lobster

```js
getUsers()

loginUser()

updateUser()
```

---

### Async / Await

#### What

等待 Promise 完成。

#### Nova Lobster

```js
const data =
await getUsers();
```

#### Graph

```text
Request
↓
Wait
↓
Response
↓
Continue
```

---

## 2. React Fundamentals

### Components

#### What

React 的积木。

#### Nova Lobster

```text
Login

Dashboard

UserManagement

AuditLogs
```

#### Graph

```text
App
│
├─ Sidebar
├─ Navbar
└─ Page
```

---

### JSX

#### What

HTML + JavaScript

#### Example

```jsx
<h1>
 {user.username}
</h1>
```

---

### Props

#### What

Parent 给 Child 的资料。

#### Graph

```text
Parent
↓
Props
↓
Child
```

---

### State

#### What

组件自己的记忆。

#### Nova Lobster

```js
users

logs

editedUsers

pendingStatus
```

#### Graph

```text
State
↓
Render
↓
UI
```

---

### useState

#### What

建立 State。

```js
const [users,setUsers]
=
useState([]);
```

---

### useEffect

#### What

组件出现后执行逻辑。

#### Nova Lobster

```js
useEffect(()=>{

 loadUsers();

},[]);
```

#### Graph

```text
Component Mount
↓
useEffect
↓
API Call
```

---

### useContext

#### What

全局共享资料。

#### Nova Lobster

```js
AuthContext
```

#### Graph

```text
AuthContext
↓
All Pages
```

---

### Re-rendering

#### What

State 改变后 React 重画。

#### Graph

```text
setState()
↓
State Change
↓
Re-render
↓
UI Update
```

---

## 3. Frontend Architecture

### Pages

```text
Login

Dashboard

UserManagement

AuditLogs
```

---

### Components

```text
Navbar

Sidebar

ProtectedRoute
```

---

### Services

#### What

负责 API。

#### Nova Lobster

```text
authService

userService

auditLogService
```

#### Graph

```text
Page
↓
Service
↓
Backend
```

---

### Context

#### What

全局 State。

#### Nova Lobster

```text
AuthContext
```

---

### ProtectedRoute

#### What

保护页面。

#### Graph

```text
Route
↓
Check User
↓
Allow / Deny
```

---

## 4. Authentication

### JWT

#### What

电子身份证。

#### Graph

```text
Login
↓
JWT
↓
Browser
```

#### Nova Lobster

```js
jwt.sign()
```

---

### verifyToken

#### What

检查 JWT。

#### Graph

```text
Request
↓
verifyToken
↓
Pass / Reject
```

---

### req.user

#### What

JWT 解码后的用户资料。

#### Nova Lobster

```js
req.user.id

req.user.role

req.user.username
```

---

### Login Flow

```text
Email
Password
↓
bcrypt
↓
JWT
↓
Dashboard
```

---

### Logout Flow

```text
Remove Token
↓
Clear Context
↓
Login Page
```
