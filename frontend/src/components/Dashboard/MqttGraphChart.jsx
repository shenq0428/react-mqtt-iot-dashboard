import { useEffect, useState } from "react"
import { io } from "socket.io-client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"


// Reusable Graph Component
function MqttReusableChart({ title, data, lines }) {

  return (
    <div className="graph_panel">

      <h2 className="panel_title">
        {title}
      </h2>

      <ResponsiveContainer width="100%" height={400}>

        <LineChart data={data}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="time" />

          <YAxis />

          <Tooltip />

          <Legend />

          {lines.map((line) => (

            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
            />

          ))}

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}
//reuseable statpanel
function RealtimeStatPanel({ title, value, titleColor}) {

  return (
    <div className="stat_panel">
      <div className="mqtt_stat_row">
        <h3 style={{color:titleColor}}>{title}➔</h3>

        <h1 style={{ color:value === 0 ? "white":"#39ff14"}}>{value}</h1>
      </div>
    </div>
  )
}
// Main MQTT Dashboard Component
function MQTTGraphChart() {
  const [chartData, setChartData] = useState([])
  const latestData = chartData[chartData.length - 1]



  useEffect(() => {

    // Connect to backend websocket
    const socket = io("http://localhost:3001")

    // Websocket connected
    socket.on("connect", () => {
      console.log("Connected to backend websocket")
    })

    // Receive realtime MQTT data
    socket.on("mqtt-message", (data) => {

      console.log("Realtime MQTT Data:", data)

      // Convert JSON string -> JavaScript object
      const parsedData = JSON.parse(data)

      console.log(parsedData)

      // Create one telemetry point
      const newPoint = {

        // Show only time
        time: parsedData.dts.split(" ")[1],

        // Blower Power
        blower1Power: parsedData.blower["blower 1"].power,
        blower2Power: parsedData.blower["blower 2"].power,
        blower3Power: parsedData.blower["blower 3"].power,

        // Pump Power
        pump1Power: parsedData.pump["pump 1"].power,
        pump2Power: parsedData.pump["pump 2"].power,
        pump3Power: parsedData.pump["pump 3"].power,

      }

      // Update realtime chart data
      setChartData((prevData) => {

        // Keep old data + add new point
        const updatedData = [...prevData, newPoint]

        // Keep latest 30 points only
        if (updatedData.length > 30) {
          updatedData.shift()
        }

        return updatedData
      })

    })

    // Cleanup websocket
    return () => {
      socket.disconnect()
    }

  }, [])

  // console.log(chartData)

  return (
    <>
      <h1>MQTT Graph Chart</h1>
      <div className="mqtt_stat_grid">

        <RealtimeStatPanel
          title="Blower 1"
          value={latestData?.blower1Power}
          titleColor="#00ff00"
        />

        <RealtimeStatPanel
          title="Blower 2"
          value={latestData?.blower2Power}
          titleColor="#00ff00"
        />

        <RealtimeStatPanel
          title="Blower 3"
          value={latestData?.blower3Power}
          titleColor="#00ff00"
        />

        <RealtimeStatPanel
          title="Pump 1"
          value={latestData?.pump1Power}
          titleColor="#ffff03"
        />

        <RealtimeStatPanel
          title="Pump 2"
          value={latestData?.pump2Power}
          titleColor="#ffff03"
        />

        <RealtimeStatPanel
          title="Pump 3"
          value={latestData?.pump3Power}
          titleColor="#ffff03"
        />

      </div>
      <div className="mqttdashboard_grid">

        <MqttReusableChart
          title="Blower Graph"
          data={chartData}
          lines={[
            {
              dataKey: "blower1Power",
              color: "yellow",
            },
            {
              dataKey: "blower2Power",
              color: "#00ffff",
            },
            {
              dataKey: "blower3Power",
              color: "blue",
            },
          ]}
        />

        <MqttReusableChart
          title="Pump Graph"
          data={chartData}
          lines={[
            {
              dataKey: "pump1Power",
              color: "yellow",
            },
            {
              dataKey: "pump2Power",
              color: "#00ffff",
            },
            {
              dataKey: "pump3Power",
              color: "blue",
            },
          ]}
        />
        <MqttReusableChart title="compare blower1 & pump1" data={chartData} lines={[
          {
            dataKey: "pump1Power",
            color: "yellow",
          },
          {
            dataKey: "blower1Power",
            color: "red",
          },
        ]}
        />
      </div>
    </>
  )
}

export default MQTTGraphChart