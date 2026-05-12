const mqtt = require("mqtt")
require("dotenv").config()

const client = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
})

client.on("connect", () => {
  console.log("Connected to MQTT Broker")

  client.subscribe("data/DEMO_IWK_260325", (err) => {
    if (!err) {
      console.log("Subscribed to all topics")
    }
  })
})

client.on("message", (topic, message) => {
  console.log(`Topic: ${topic}`)
  console.log(`Message: ${message.toString()}`)
})