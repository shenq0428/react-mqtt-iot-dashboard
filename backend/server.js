require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const startMQTTBridge = require("./gateway/mqttSocketBridge");
//npm install express-list-endpoints to test api
const listEndpoints = require("express-list-endpoints");
// Routes
const testRoutes = require("./routes/testRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const auditRoutes = require("./routes/auditRoutes")
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", testRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/audit-logs", auditRoutes)

// Create HTTP server
const server = http.createServer(app);

// Create websocket server
/* "http://localhost:5173" is for localhost
http://43.216.195.182 is for online after deploy at aws, 
is a frontend URL and could be setup in .env example:origin: process.env.FRONTEND_URL,*/
const io = new Server(server, {
    cors: { origin: ["http://localhost:5173", process.env.FRONTEND_URL], methods: ["GET", "POST"] },
});
// Frontend websocket connected
io.on("connection", (socket) => { console.log("Frontend connected"); });

console.log("Start MQTT Bridge");

// Start MQTT bridge
startMQTTBridge(io);

const PORT = process.env.PORT || 3001;

// Start backend server
server.listen(PORT, () => { console.log(`Backend server running on port ${PORT}`); });

console.log(listEndpoints(app));