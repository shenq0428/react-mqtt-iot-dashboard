require("dotenv").config();

const mqtt = require("mqtt");

const client = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

client.on("connect", () => {
  console.log("Connected!");

  setInterval(() => {
    const payload = {
      device: "blower_1",
      temperature: (28 + Math.random() * 5).toFixed(2),
      humidity: (60 + Math.random() * 10).toFixed(2),
      timestamp: new Date().toISOString(),
    };

    client.publish(
      "sensor/blower_1",
      JSON.stringify(payload)
    );

    console.log("Published:", payload);
  }, 3000);
});