import { useEffect, useState } from "react"
import socket from "../../services/socketClient"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
//icon import 
import { Wifi, Activity, MessageSquareMore, Clock3, Landmark } from "lucide-react"


function IwkDemo() {
    const equipmentColors = {
        blower_1: "#00FFFF",
        blower_2: "#FF6B6B",
        blower_3: "#FFD93D",
        pump_1: "#A855F7",
        pump_2: "#22C55E",
        pump_3: "#F97316",
    }
    // ALL TELEMETRY DATA
    const [graphData, setGraphData] = useState([])

    // SELECTED EQUIPMENTS
    const [selectedEquipments, setSelectedEquipments] = useState(["blower_1", "blower_2", "blower_3", "pump_1", "pump_2", "pump_3"])

    const [refreshInterval, setRefreshInterval] = useState(0)

    //record message in websocket
    const [messageCount, setMessageCount] = useState(0)
    //MQTT STATUS dashboard panel
    const [mqttConnected, setMqttConnected] = useState(false)
    //LAST ONLINE dashboard panel
    const [lastOnline, setLastOnline] = useState("--:--:--")
    // HANDLE CHECKBOX CLICK
    function handleEquipmentChange(equipment) {
        setSelectedEquipments((prev) => {
            // REMOVE EQUIPMENT
            if (prev.includes(equipment)) {
                return prev.filter(
                    (item) => item !== equipment
                )
            }
            // ADD EQUIPMENT
            return [...prev, equipment]
        })
    }
    function fetchHistoryData() {
        fetch(`${import.meta.env.VITE_API_URL}/api/history`)
            .then((response) => response.json())
            .then((data) => {
                console.log(
                    data.filter((item) => item.equipment?.includes("blower"))
                )

                const filteredData = data
                    .filter((item) => selectedEquipments.includes(item.equipment) && item._field === "motor_amp")
                console.log(
                    "LAST 20 FILTERED:",
                    filteredData.slice(-20)
                )

                const slicedData = filteredData.slice(-300)
                //step 2 : fix the main point
                const groupedData = []
                // step 3: fix the timestamp sychronization
                filteredData.forEach((item) => {

                    // ROUND TO SECOND
                    const roundedTime =
                        Math.floor(new Date(item._time).getTime() / 1000) * 1000

                    let existingPoint =
                        groupedData.find(
                            (point) => point.timestamp === roundedTime)

                    // CREATE NEW POINT
                    if (!existingPoint) {
                        existingPoint = {
                            timestamp: roundedTime,
                            time: new Date(roundedTime).toLocaleTimeString()

                        }
                        groupedData.push(existingPoint)

                    }

                    // ADD EQUIPMENT VALUE
                    existingPoint[item.equipment] = item._value

                })
                //  step 4:SORT TIME
                groupedData.sort(
                    (a, b) =>
                        //new Date(`1970/01/01 ${a.time}`) -
                        //new Date(`1970/01/01 ${b.time}`)
                        a.timestamp - b.timestamp
                )
                console.log(
                    "blower_1 fetch count:",
                    groupedData.filter(
                        (point) =>
                            point.blower_1 !== undefined
                    ).length
                )
                console.log(
                    "blower_2 fetch count:",
                    groupedData.filter(
                        (point) =>
                            point.blower_2 !== undefined
                    ).length
                )

                //step 5
                setGraphData(groupedData)
                setLastOnline(new Date().toLocaleTimeString())
            })
            .catch((error) => {
                console.error(error)
            })
    }

    // FETCH HISTORICAL DATA
    useEffect(() => {
        fetchHistoryData()
        let intervalId
        if (refreshInterval > 0) {
            intervalId = setInterval(() => {
                console.log("Auto Refresh Triggered")
                fetchHistoryData()
            }, refreshInterval)

        }
        if (refreshInterval === 0) {
            setMqttConnected(socket.connected)

            socket.on("connect", () => {
                setMqttConnected(true)
            })
            socket.on("disconnect", () => {
                setMqttConnected(false)
            })
            // REALTIME MQTT WEBSOCKET
            socket.on("mqtt-message", (data) => {

                setMessageCount((prev) => prev + 1)

                const roundedTime = Math.floor(Date.now() / 1000) * 1000

                const realtimePoint = {

                    timestamp: roundedTime,

                    time: new Date(
                        roundedTime
                    ).toLocaleTimeString()

                }

                /*
                const filteredData = []

                selectedEquipments.forEach(
                    (equipment) => {

                        const equipmentData = data
                            .filter(
                                (item) =>
                                    item.equipment === equipment &&
                                    item._field === "motor_amp"
                            )
                            .slice(-50)

                        filteredData.push(
                            ...equipmentData
                        )

                    }
                )
*/
                //last online dashboard panel
                setLastOnline(new Date().toLocaleTimeString())

                // BLOWERS
                Object.entries(data.blower).forEach(
                    ([equipmentName, equipmentData]) => {
                        const formattedEquipment =
                            equipmentName.replace(" ", "_")

                        // ONLY ADD SELECTED
                        if (
                            selectedEquipments.includes(
                                formattedEquipment
                            )
                        ) {
                            realtimePoint[formattedEquipment] =
                                equipmentData["motor-amp"]
                        }

                        if (formattedEquipment === "blower_1") {

                            console.log(
                                "blower_1 realtime:",
                                equipmentData["motor-amp"]
                            )

                        }
                    }
                )

                // PUMPS
                Object.entries(data.pump).forEach(
                    ([equipmentName, equipmentData]) => {

                        const formattedEquipment =
                            equipmentName.replace(" ", "_")

                        // ONLY ADD SELECTED
                        if (
                            selectedEquipments.includes(
                                formattedEquipment
                            )
                        ) {
                            realtimePoint[formattedEquipment] =
                                equipmentData["motor-amp"]
                        }
                    }
                )

                //console.log("Realtime Point:", realtimePoint)
                // APPEND REALTIME DATA
                setGraphData((prev) => {
                    const existingPoint =
                        prev.find((point) => point.timestamp === roundedTime)

                    // SAME SECOND ,merge all data to 1 same data time
                    if (existingPoint) {

                        Object.assign(
                            existingPoint,
                            realtimePoint
                        )
                        return [...prev]
                    }

                    const updated = [
                        ...prev,
                        realtimePoint
                    ]
                    // KEEP LAST 100 POINTS
                    return updated.slice(-200)
                })
            })
        }
        // CLEANUP SOCKET
        return () => {
            socket.off("mqtt-message")

            clearInterval(intervalId)
        }
    }, [selectedEquipments, refreshInterval])

    return (

        <div>
            {/* HEADER */}
            <div className="Iwk_header">
                <h1>DEMO_IWK_260325</h1>
            </div>
            {/* DASHBOARD CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}
            >
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: 0 }}
                            >MQTT Status</h3>
                            <h1 style={{ color: mqttConnected ? "#4ADE80" : "#FF4D4D", marginBottom: "30px" }}
                            >{mqttConnected ? "Connected" : "Disconnected"}</h1>
                        </div>
                        <Wifi color={mqttConnected ? "#f700ff" : "#FF4D4D"} size={64} />
                    </div>
                </div>
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: 0 }}
                            >SELECTED EQUIPMENT</h3>
                            <h1 style={{ color: "yellow", marginBottom: "30px" }}
                            >{selectedEquipments.length}</h1>
                        </div>
                        <Activity size={64} color="#f700ff" />
                    </div>
                </div>
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: 0 }}
                            >REFRESH MODE</h3>
                            <h1 style={{ color: "yellow", marginBottom: "30px" }}
                            >{refreshInterval === 0 ? "Real Time" : `${refreshInterval / 1000}s`}</h1>
                        </div>
                        <MessageSquareMore size={64} color="#f700ff" />
                    </div>
                </div>
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: "0px" }}
                            >LAST ONLINE</h3>
                            <h1 style={{ color: "yellow", marginBottom: "30px" }}
                            >{lastOnline}</h1>
                        </div>
                        <Clock3 size={64} color="#f700ff" />
                    </div>
                </div>
            </div>
            {/* GRAPH */}
            <div
                style={{
                    background: `linear-gradient(180deg, #0F172A, #020617)`,
                    padding: "20px",
                    borderRadius: "12px",
                    width: "100%"
                }}
            >
                {/* TELEMETRY CHARTS */}
                <div>

                    <LineChart
                        width={1600}
                        height={750}
                        data={graphData}
                    >
                        <CartesianGrid
                            stroke="#334155"
                            strokeDasharray="3 3"
                        />
                        <XAxis
                            dataKey="time"
                            stroke="#94A3B8"
                        />

                        <YAxis
                            stroke="#94A3B8"
                            domain={[0, "dataMax + 20"]}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#111827",
                                border: "1px solid #00FFFF",
                                borderRadius: "10px",
                                color: "#fff"
                            }}
                        />
                        <Legend />
                        {
                            selectedEquipments.map((equipment) => (
                                <Line
                                    key={equipment}
                                    type="natural"
                                    dataKey={equipment}
                                    strokeWidth={2}
                                    activeDot={{ r: 6 }}
                                    stroke={equipmentColors[equipment]}
                                    dot={false}
                                    isAnimationActive={false}
                                    connectNulls={true}
                                />
                            ))
                        }
                    </LineChart>
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "20px"
                }}
            >
                <div className="refresh_button"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginTop: "20px",
                        marginBottom: "20px",
                        padding: "12px 16px",
                        background: "#111827",
                        borderRadius: "10px",
                        width: "fit-content"
                    }}
                >

                    <h4 style={{ margin: 0, color: "#E5E7EB" }}>
                        REFRESH MODE
                    </h4>

                    <select
                        value={refreshInterval}

                        onChange={(e) =>
                            setRefreshInterval(
                                Number(e.target.value)
                            )
                        }
                        style={{
                            padding: "6px 10px", borderRadius: "6px", border: "none", background: "#1F2937", color: "white", cursor: "pointer"
                        }}
                    >
                        <option value={0}>
                            AUTO</option>
                        <option value={3000}>
                            3 Seconds</option>
                        <option value={5000}>
                            5 Seconds</option>
                        <option value={10000}>
                            10 Seconds </option>
                        <option value={30000}>
                            30 Seconds</option>
                    </select>

                </div>
            </div>
            {/* EQUIPMENT FILTER */}
            <div
                style={{
                    marginTop: "20px",

                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                }}
            >

                <label>
                    <button onClick={() => setSelectedEquipments(["blower_1", "blower_2", "blower_3", "pump_1", "pump_2", "pump_3"])}>
                        SELECT ALL EQUIPMENT
                    </button>
                </label>
                <label>
                    <input type="checkbox" checked={selectedEquipments.includes("blower_1")}
                        onChange={() => handleEquipmentChange("blower_1")} />
                    Blower 1
                </label>
                <label>
                    <input type="checkbox" checked={selectedEquipments.includes("blower_2")}
                        onChange={() => handleEquipmentChange("blower_2")} />
                    Blower 2
                </label>
                <label>
                    <input type="checkbox" checked={selectedEquipments.includes("blower_3")}
                        onChange={() => handleEquipmentChange("blower_3")} />
                    Blower 3
                </label>

                <label>
                    <input type="checkbox" checked={selectedEquipments.includes("pump_1")}
                        onChange={() => handleEquipmentChange("pump_1")} />
                    Pump 1
                </label>
                <label>
                    <input type="checkbox" checked={selectedEquipments.includes("pump_2")}
                        onChange={() => handleEquipmentChange("pump_2")} />
                    Pump 2
                </label>
                <label>
                    <input type="checkbox" checked={selectedEquipments.includes("pump_3")}
                        onChange={() => handleEquipmentChange("pump_3")} />
                    Pump 3
                </label>
            </div>
        </div>
    )
}

export default IwkDemo