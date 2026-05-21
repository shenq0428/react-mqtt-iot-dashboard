import { useEffect, useState } from "react"
import socket from "../../services/socketClient"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
//icon import 
import { Wifi, Activity, Database, Clock3 } from "lucide-react"


function IwkDemo() {
    const equipmentColors = {
        blower_1: "#00FFFF",
        blower_2: "#FF6B6B",
        blower_3: "#FFD93D",
    }
    // ALL TELEMETRY DATA
    const [graphData, setGraphData] = useState([])

    // SELECTED EQUIPMENTS
    const [selectedEquipments, setSelectedEquipments] = useState(["blower_1", "blower_2", "blower_3"])

    const [refreshInterval, setRefreshInterval] = useState(0)

    //record message in websocket
    const [messageCount, setMessageCount] = useState(0)

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
        fetch("http://localhost:3001/api/history")
            .then((response) => response.json())
            .then((data) => {
                const filteredData = data
                    .filter(
                        (item) =>
                            selectedEquipments.includes(item.equipment) &&
                            item._field === "motor_amp"
                    )
                    .slice(-300)
                //step 2 : fix the main point
                const groupedData = []
                // step 3: fix the timestamp sychronization
                filteredData.forEach((item) => {

                    // ROUND TO SECOND
                    const roundedTime =
                        Math.floor(
                            new Date(item._time).getTime() / 1000
                        ) * 1000

                    let existingPoint =
                        groupedData.find(
                            (point) =>
                                point.timestamp === roundedTime
                        )

                    // CREATE NEW POINT
                    if (!existingPoint) {

                        existingPoint = {

                            timestamp: roundedTime,

                            time: new Date(
                                roundedTime
                            ).toLocaleTimeString()

                        }

                        groupedData.push(existingPoint)

                    }

                    // ADD EQUIPMENT VALUE
                    existingPoint[item.equipment] =
                        item._value

                })
                //  step 4:SORT TIME
                groupedData.sort(
                    (a, b) =>
                        //new Date(`1970/01/01 ${a.time}`) -
                        //new Date(`1970/01/01 ${b.time}`)
                        a.timestamp - b.timestamp
                )
                //step 5
                setGraphData(groupedData)
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
            // REALTIME MQTT WEBSOCKET
            socket.on("mqtt-message", (data) => {

                setMessageCount((prev) => {
                })
                const roundedTime =

                    Math.floor(Date.now() / 1000) * 1000

                const realtimePoint = {

                    timestamp: roundedTime,

                    time: new Date(
                        roundedTime
                    ).toLocaleTimeString()

                }

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
                // APPEND REALTIME DATA
                setGraphData((prev) => {
                    const updated = [
                        ...prev,
                        realtimePoint
                    ]
                    // KEEP LAST 100 POINTS
                    return updated.slice(-100)
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
                <h3>
                    Graph Points: {graphData.length}
                </h3>
            </div>
            {/* DASHBOARD CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "20px" }}
            >
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: 0 }}
                            >MQTT Status</h3>
                            <h1 style={{ color: "#4ADE80", marginBottom: "30px" }}
                            > Connected</h1>
                        </div>
                        <Wifi size={42} color="#3B82F6" opacity={0.4} />
                    </div>
                </div>
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: 0 }}
                            >ACTIVE EQUIPMENT</h3>
                            <h1 style={{ color: "yellow", marginBottom: "30px" }}
                            >{selectedEquipments.length}</h1>
                        </div>     <Activity size={42} color="#3B82F6" opacity={0.4} />
                    </div>
                </div>
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: 0 }}
                            >LIVE MESSAGES</h3>
                            <h1 style={{ color: "yellow", marginBottom: "30px" }}
                            >{messageCount}</h1>
                        </div>    <Database size={42} color="#3B82F6" opacity={0.4} />
                    </div></div>
                <div style={{ background: "#111827", borderRadius: "16px", padding: "20px", boxShadow: `0 0 15px rgba(0,255,255,0.18),0 0 30px rgba(0,255,255,0.10),0 0 60px rgba(0,255,255,0.05)` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
                        <div>
                            <h3 style={{ color: "#00FFFF", marginBottom: "0px" }}
                            >SYSTEM UPTIME</h3>
                            <h1 style={{ color: "yellow", marginBottom: "30px" }}
                            > 0day 7h</h1>
                        </div>
                        <Clock3 size={42} color="#3B82F6" opacity={0.4} />
                    </div></div>
            </div>
            {/* GRAPH */}
            <div
                style={{
                    background: "#0b1220",

                    padding: "20px",

                    borderRadius: "12px",

                    width: "100%"
                }}
            >
                {/* TELEMETRY CHARTS */}
                <div>

                    <LineChart
                        width={1400}
                        height={500}
                        data={graphData}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        {
                            selectedEquipments.map((equipment) => (
                                <Line
                                    key={equipment}
                                    type="natural"
                                    dataKey={equipment}
                                    strokeWidth={2}
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
                    <button onClick={() => setSelectedEquipments(["blower_1", "blower_2", "blower_3"])}>
                        SELECT ALL
                    </button>
                    <input
                        type="checkbox"
                        checked={
                            selectedEquipments.includes(
                                "blower_1"
                            )
                        }
                        onChange={() =>
                            handleEquipmentChange(
                                "blower_1"
                            )} />
                    Blower 1
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={
                            selectedEquipments.includes(
                                "blower_2"
                            )
                        }
                        onChange={() =>
                            handleEquipmentChange(
                                "blower_2"
                            )} />
                    Blower 2
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={
                            selectedEquipments.includes(
                                "blower_3"
                            )
                        }
                        onChange={() =>
                            handleEquipmentChange(
                                "blower_3"
                            )} />
                    Blower 3
                </label>
            </div>
        </div>
    )
}

export default IwkDemo