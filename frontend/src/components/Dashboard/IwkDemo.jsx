import { useEffect, useState } from "react"
import socket from "../../services/socketClient"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts"

function IwkDemo() {
    const equipmentColors = {
        blower_1: "#00FFFF",
        blower_2: "#FF6B6B",
        blower_3: "#FFD93D",
    }
    // ALL TELEMETRY DATA
    const [graphData, setGraphData] = useState([])

    // SELECTED EQUIPMENTS
    const [selectedEquipments, setSelectedEquipments] = useState(["blower_1"])

    const [refreshInterval, setRefreshInterval] = useState(0)
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
                        new Date(`1970/01/01 ${a.time}`) -
                        new Date(`1970/01/01 ${b.time}`)
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
    }, [selectedEquipments,refreshInterval])

    return (

        <>
            {/* HEADER */}
            <div className="Iwk_header">
                <h1>DEMO_IWK_260325</h1>
                <h3>
                    Graph Points: {graphData.length}
                </h3>
            </div>

            {/* TELEMETRY CHARTS */}
            <div>

                <LineChart
                    width={1000}
                    height={300}
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
                                type="monotone"
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
            <div
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
                    Auto Refresh
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
            {/* EQUIPMENT FILTER */}
            <div>
                <label>
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
        </>
    )
}

export default IwkDemo