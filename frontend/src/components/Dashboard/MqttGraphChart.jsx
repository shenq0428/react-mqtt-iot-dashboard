import { useEffect } from "react"
import { io } from "socket.io-client"

function MQTTGraphChart() {

  useEffect(() => {

    // Connect to backend websocket
    const socket = io("http://localhost:3001")

    // Connected
    socket.on("connect", () => {
      console.log("Connected to backend websocket")
    })

    // Receive MQTT data
    socket.on("mqtt-message", (data) => {
      console.log("Realtime MQTT Data:", data)
    })

    // Cleanup
    return () => {
      socket.disconnect()
    }

  }, [])

  return (
    <div>
      MQTT Graph Chart
    </div>
  )
}

export default MQTTGraphChart