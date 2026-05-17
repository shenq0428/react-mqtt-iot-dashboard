// This file is currently not in use, as we are using Socket.IO to receive MQTT messages from the backend.
// However, if you want to connect directly to the MQTT broker from the frontend, you can use this file as a starting point.
import mqtt from "mqtt"

const client = mqtt.connect("")

client.on("connect",()=>{
    console.log("Connected to MQTT Broker from frontend")

    client.subscribe("",(err)=>{
        if(!err){
            console.log("Subscribed to xxx topic from frontend")
        }
    })
})

client.on("message",(topic,message)=>{
    console.log("Received:",topic,message.toString())
})
export default client