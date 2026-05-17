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