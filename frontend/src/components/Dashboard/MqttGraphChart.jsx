import { useEffect, useState } from "react"
import socket from "../../services/socketClient"

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

        <LineChart data={data} >
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

              strokeWidth={1}
              dot={false}
              //dot={true}
              //isAnimationActive={false}
              isAnimationActive={false}
              animationDuration={300}
            />

          ))}

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}
//reuseable statpanel
function RealtimeStatPanel({ title, power, status, titleColor }) {

  return (
    <div className="stat_panel">
      <div className="mqtt_stat_row">

        <h3 style={{ color: titleColor }}>
          {title}
        </h3>

        <h1 style={{ color: power === 0 ? "red" : "#39ff14" }}>
          {power}
        </h1>

      </div>

      <h2 style={{ color: status === 1 ? "#39ff14" : "red" }}>
        {status === 1 ? "RUNNING" : "STOPPED"}</h2>
    </div>
  )
}
// Main MQTT Dashboard Component
function MQTTGraphChart() {
  const [chartData, setChartData] = useState([])
  const latestData = chartData[chartData.length - 1]
  const [alarmLogs, setAlarmLogs] = useState([])


  useEffect(() => {



    // Websocket connected
    socket.on("connect", () => {
      console.log("Connected to backend websocket")
    })

    // Receive realtime MQTT data
    socket.on("mqtt-message", (data) => {

      //console.log("Realtime MQTT Data:", data)

      // Convert JSON string -> JavaScript object
      const parsedData = (data)

      //console.log(parsedData)

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

        //Blower Status
        blower1Status: parsedData.blower["blower 1"].run_status,
        blower2Status: parsedData.blower["blower 2"].run_status,
        blower3Status: parsedData.blower["blower 3"].run_status,

        pump1Status: parsedData.pump["pump 1"].run_status,
        pump2Status: parsedData.pump["pump 2"].run_status,
        pump3Status: parsedData.pump["pump 3"].run_status,

      }
      //log alarm
      const newAlarms = []
      //alarm loop
      const devicesToCheck = [
        {
          name: "Blower 1",
          power: newPoint.blower1Power,
        },
        {
          name: "Blower 2",
          power: newPoint.blower2Power,
        },
        {
          name: "Blower 3",
          power: newPoint.blower3Power,
        },
        {
          name: "Pump 1",
          power: newPoint.pump1Power,
        },
        {
          name: "Pump 2",
          power: newPoint.pump2Power,
        },
        {
          name: "Pump 3",
          power: newPoint.pump3Power,
        },

      ]

      devicesToCheck.forEach((device) => {
        if (device.power >= 16) {
          newAlarms.push({
            timestamp: parsedData.dts,
            device: device.name,
            power: device.power,
          })
        }
      })
      if (newAlarms.length > 0) {

        setAlarmLogs((prevLogs) => {

          const updatedLogs = [
            ...newAlarms,
            ...prevLogs,
          ]

          return updatedLogs.slice(0, 20)

        })

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
    //testing  get api 
    fetch("http://localhost:3001/api/test")
      .then((res) => res.json())
      .then((data) => {
        console.log("FRONTEND GET response:", data)
      })

    //testing post api
    fetch("http://localhost:3001/api/alarm", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        device: "Blower 1",
        power: 18,
      }),
    }).then((res) => res.json())
      .then((data) => { console.log("FRONTEND POST response:", data) })
    // Cleanup websocket


    fetch("http://localhost:3001/api/threshold")
      .then((res) => res.json())
      .then((data) => {
        console.log("FRONTEND GET response (Threshold):", data.currentThreshold)
      })
    //frontend patch function
    fetch("http://localhost:3001/api/device/123",{
      method:"PATCH",
      headers:{"Content-Type":"application/json",},
      body:JSON.stringify({
        status:"online"
      })
    })
    //frotend delete function
    fetch("http://localhost:3001/api/alarm/999",{
      method:"DELETE"
    })

    return () => {
      socket.off("mqtt-message")
    }
  }, [])

  // console.log(chartData)

  return (
    <>
      <h1>MQTT Graph Chart</h1>
      <div className="mqtt_stat_grid">

        <RealtimeStatPanel
          title="Blower 1"
          power={latestData?.blower1Power}
          status={latestData?.blower1Status}
          titleColor="#00ffd5"
        />

        <RealtimeStatPanel
          title="Blower 2"
          power={latestData?.blower2Power}
          status={latestData?.blower2Status}
          titleColor="#00ffd5"
        />

        <RealtimeStatPanel
          title="Blower 3"
          power={latestData?.blower3Power}
          status={latestData?.blower3Status}
          titleColor="#00ffd5"
        />

        <RealtimeStatPanel
          title="Pump 1"
          power={latestData?.pump1Power}
          status={latestData?.pump1Status}
          titleColor="#ffff03"
        />

        <RealtimeStatPanel
          title="Pump 2"
          power={latestData?.pump2Power}
          status={latestData?.pump2Status}
          titleColor="#ffff03"
        />

        <RealtimeStatPanel
          title="Pump 3"
          power={latestData?.pump3Power}
          status={latestData?.pump3Status}
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

      <div className="alarm_logs_panel">
        <h2>Alarm Logs</h2>
        <table className="alarm_table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Device</th>
              <th>Power</th>
            </tr>
          </thead>
          <tbody>
            {alarmLogs.map((log, index) => (
              <tr key={index}>
                <td>{log.timestamp}</td>
                <td>{log.device}</td>
                <td>{log.power}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default MQTTGraphChart