require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const startMQTTBridge = require("./gateway/mqttSocketBridge");

// Routes
const testRoutes = require("./routes/testRoutes");
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", testRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create websocket server
const io = new Server(server, { cors: {   origin: "http://localhost:5173", },});

// Frontend websocket connected
io.on("connection", (socket) => { console.log("Frontend connected");});

console.log("Start MQTT Bridge");

// Start MQTT bridge
startMQTTBridge(io);

const PORT = process.env.PORT || 3001;

// Start backend server
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});