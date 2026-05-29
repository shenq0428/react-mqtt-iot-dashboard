# Register Flow

用户输入 email / password
↓
backend 接收 request
↓
validation（检查资料格式）
↓
检查 email 是否已经存在
↓
bcrypt.hash(password)
↓
password + salt → hashed password
↓
INSERT INTO users table
↓
PostgreSQL 储存 user data
↓
return success response


# Login Flow

用户输入 email / password
↓
backend 接收 request
↓
SELECT user FROM database
↓
找到对应 email 的 user
↓
bcrypt.compare(inputPassword, storedHash)
↓
验证 password 是否正确
↓
jwt.sign()
↓
生成 JWT token
↓
return token 给 frontend


# Auth Core Concept

Register:
plaintext password
↓
hash + salt
↓
store hashed password in database

Login:
input password
↓
bcrypt.compare()
↓
compare with stored hash
↓
if correct → generate JWT


# Backend Request Lifecycle

Frontend / Postman Request
↓
Route
↓
Controller
↓
Business Logic
↓
Database Query
↓
JSON Response


# Database Relationship Concept

users
↓
devices
↓
mqtt_logs
↓
alerts

Backend architecture 本质是：
Data + Relationship + Flow


# Time-Series Data Tradeoff

Raw data = 高准确度，但储存成本高。
Summary data = 准确度较低，但储存成本较低。

随着数据越来越旧，
详细精度的重要性通常会低于整体趋势的重要性。

# Nova Lobster Backend Fundamentals Notes

## 1. String

String = 文字资料

```js
const username = "wongzs"
```

Examples:

```js
"hello"
"admin"
"123456"
```

---

## 2. Number

Number = 数字

```js
const age = 22
```

Examples:

```js
100
3.14
-20
```

---

## 3. Object

Object = 一个东西的属性集合

```js
const user = {
    username: "wongzs",
    password: "123456",
    role: "admin"
}
```

取值：

```js
user.username
```

结果：

```js
"wongzs"
```

---

## 4. Array

Array = 一堆东西放在一起

```js
const users = [
    {
        username: "nova"
    },
    {
        username: "john"
    }
]
```

取得第一个元素：

```js
users[0]
```

结果：

```js
{
    username: "nova"
}
```

### Object vs Array

Object：

```js
const user = {
    username: "nova",
    role: "admin"
}
```

代表一个用户。

Array：

```js
const users = [
    user1,
    user2,
    user3
]
```

代表很多用户。

---

## 5. push()

push() = 加入新的资料到 Array

```js
const users = []

users.push({
    username: "nova"
})
```

结果：

```js
[
    {
        username: "nova"
    }
]
```

---

## 6. find()

find() = 在 Array 里面寻找符合条件的资料

```js
const user = users.find(
    user => user.username === "john"
)
```

找到后：

```js
{
    username: "john"
}
```

找不到：

```js
undefined
```

---

## 7. JSON

JSON = Frontend 与 Backend 通讯的标准格式

```json
{
    "username": "wongzs",
    "role": "admin"
}
```

用途：

```text
Frontend
↓
Internet
↓
Backend
```

传送资料。

---

## 8. JSON.stringify()

Object → String

```js
const user = {
    username: "nova"
}

const text = JSON.stringify(user)
```

结果：

```js
'{"username":"nova"}'
```

---

## 9. JSON.parse()

String → Object

```js
const text = '{"username":"nova"}'

const user = JSON.parse(text)
```

结果：

```js
{
    username: "nova"
}
```

---

## 10. JWT Example

Login 成功：

```js
const token = jwt.sign(
    {
        username: user.username,
        role: user.role
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
)
```

验证 JWT：

```js
const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET
)
```

decoded：

```js
{
    username: "wongzs",
    role: "admin",
    iat: 1779780496,
    exp: 1779784096
}
```

Middleware：

```js
req.user = decoded
```

后面 Route：

```js
req.user.username
req.user.role
```

即可取得当前登录用户资料。

---

# Core Flow Summary

```text
String
↓
Object
↓
Array
↓
JSON
↓
stringify()
↓
parse()
↓
push()
↓
find()
↓
JWT
↓
Middleware
↓
req.user
```
