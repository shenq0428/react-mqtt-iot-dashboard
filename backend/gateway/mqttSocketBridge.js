const mqtt = require("mqtt")
const writeTelemetry = require ("../influxdb/influxWrite.js")

function startMQTTBridge(io) {
  // WebSocket frontend connected
   let connectedFrontendCount =0
  io.on("connection", (socket) => {
    
    connectedFrontendCount++
    console.log("Frontend connected")
    console.log("Socket ID:", socket.id)
    console.log("Online Frontends:", connectedFrontendCount)
    // Frontend disconnected
    socket.on("disconnect", () => {
      connectedFrontendCount--
      console.log("Frontend disconnected")
      console.log("Online Frontends:", connectedFrontendCount)
    })
  })
  // MQTT Connection
  const client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
  })

  // MQTT Connected
  client.on("connect", () => {
    console.log("Connected to MQTT Broker at backend")

    client.subscribe("data/DEMO_IWK_260325", (err) => {
      if (!err) {
        console.log("Subscribed to topic at backend")
      }
    })
  })

  // MQTT Message Received
  client.on("message", (topic, message) => {
    //const data = message.toString()
    const parseData=JSON.parse(message.toString())
    console.log(parseData)
    writeTelemetry(parseData)
    // Send data to frontend
    //io.emit("mqtt-message", data)
    io.emit("mqtt-message",parseData)
  })
}

module.exports = startMQTTBridge