require("dotenv").config()
const mqtt = require("mqtt")
const { Server } = require("socket.io")
const http = require("http")

// Create HTTP server
const server = http.createServer()

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
})

// MQTT Connection
const client = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
})

// MQTT Connected
client.on("connect", () => {
  console.log("Connected to MQTT Broker")

  client.subscribe("data/DEMO_IWK_260325", (err) => {
    if (!err) {
      console.log("Subscribed to topic")
    }
  })
})

// MQTT Message Received
client.on("message", (topic, message) => {
  const data = message.toString()

  console.log(`Topic: ${topic}`)
  console.log(`Message: ${data}`)

  // Send data to frontend
  io.emit("mqtt-message", data)
})

// Frontend websocket connected
io.on("connection", (socket) => {
  console.log("Frontend connected")
})

// Start websocket server
server.listen(3001, () => {
  console.log("WebSocket server running on port 3001")
})