# AWS EC2 Quick Note (Nova Lobster)

## 什么是 EC2

EC2 = Elastic Compute Cloud

简单理解：

```text
自己的云端电脑
```

---

## EC2 能做什么

可以安装：

* Node.js
* React
* Express
* PostgreSQL
* Mosquitto
* InfluxDB
* Nginx
* Docker

---

window shell开启 输入 cd "C:\Users\USER\Downloads"
## 登录 EC2

SSH:

```bash
ssh -i NovaLobsterKeyPair.pem ubuntu@PUBLIC_IP
```

解释：

```text
ssh
=
远端登入

-i
=
使用私钥

NovaLobsterKeyPair.pem
=
AWS Key Pair

ubuntu
=
Linux 用户

PUBLIC_IP
=
EC2 公网 IP
```

---

## 查看 RAM

```bash
free -h
```

作用：

```text
查看内存(RAM)
```

---

## 查看硬盘

```bash
df -h
```

作用：

```text
查看 Storage
```

---

## Linux 服务管理

查看服务：

```bash
sudo systemctl status nginx
```

启动服务：

```bash
sudo systemctl start nginx
```

停止服务：

```bash
sudo systemctl stop nginx
```

重启服务：

```bash
sudo systemctl restart nginx
```

开机自动启动：

```bash
sudo systemctl enable nginx
```

---

## Security Group

作用：

```text
AWS Firewall
```

类似：

```text
verifyToken
但保护的是服务器
```

常见 Port：

22   SSH

80   HTTP

443  HTTPS

1883 MQTT

8086 InfluxDB

3001 Express

---

## Nova Lobster Architecture

Users
│
▼
Domain
│
▼
Nginx
│
▼
Express API
│
├── Neon PostgreSQL
│
├── MQTT Broker
│
└── InfluxDB

---

## 未来部署路线

Phase 1
✓ Neon PostgreSQL

Phase 2
✓ EC2 Ubuntu

Phase 3
→ Node.js

Phase 4
→ PM2

Phase 5
→ Nginx

Phase 6
→ HTTPS

Phase 7
→ Domain

Phase 8
→ CI/CD

Phase 9
→ Docker
