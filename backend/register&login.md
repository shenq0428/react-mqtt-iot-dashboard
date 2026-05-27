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