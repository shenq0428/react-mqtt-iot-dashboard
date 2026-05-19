require("dotenv").config()

const express = require("express")
const cors = require("cors")
const http = require("http")
const { Server } = require("socket.io")

const startMQTTBridge = require("./gateway/mqttSocketBridge")
const getTelemetryHistory = require("./influxdb/influxQuery")

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

const testRoutes = require("./routes/testRoutes")
app.use("/api",testRoutes)

// Create HTTP server
const server = http.createServer(app)

// Create websocket server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
})

// Frontend websocket connected
io.on("connection", (socket) => {
  console.log("Frontend connected")
})

// Start MQTT bridge
startMQTTBridge(io)

const PORT = process.env.PORT || 3001

app.get("/api/history", async (req, res) => {

  try {

    const data = await getTelemetryHistory();

    res.json(data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to fetch telemetry history"
    });
  }
})

// Start backend server
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})