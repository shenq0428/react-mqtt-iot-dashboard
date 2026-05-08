import { useEffect, useState } from "react"
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"

function FakeGraphChart() {

    const [chartData, setChartData] = useState([])

    useEffect(() => {

        const interval = setInterval(() => {

            const newData = {
                time: new Date().toLocaleTimeString(),
                temperature: Math.floor(Math.random() * 10) + 20,
                humidity: Math.floor(Math.random() * 20) + 40,
                cpu: Math.floor(Math.random() * 50) + 10
            }

            setChartData(prev => {

                const updatedData = [...prev, newData]

                if (updatedData.length > 20) {
                    updatedData.shift()
                }

                return updatedData
            })

        }, 3000)

        return () => clearInterval(interval)

    }, [])

    const latestData = chartData[chartData.length - 1]
    return (

        <div>
            <h2 >Fake Graph Chart🐙</h2>
            <p>wait for 3 second,information hierarchy design</p>

            <div className="stats_grid">
                <div className="stat_card">
                    <h3>CPU</h3>
                    <p>{latestData?.cpu ?? "--"}°C</p>
                </div>
                <div className="stat_card">
                    <h3>Humidity</h3>
                    <p>{latestData?.humidity ?? "--"}°C</p>
                </div>
                <div className="stat_card">
                    <h3>Temperature</h3>
                    <p>{latestData?.temperature ?? "--"}°C</p>
                </div>
            </div>


            <div className="dashboard_grid">
                <div className="graph_panel">
                    <h2 className="panel_title">Temperature / Humidity / CPU</h2>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid stroke="#bc0d0d" strokeDasharray="3 3" />
                            <XAxis dataKey="time" stroke="#cbd5e1" />
                            <YAxis stroke="#cbd5e1" />
                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "0.5px solid #334155" }} />
                            <Legend verticalAlign="top" />
                            <Line type="linear" dataKey="temperature" stroke="#00ffff" strokeWidth={2} />
                            <Line type="monotone" dataKey="humidity" stroke="#387908" />
                            <Line type="basic" dataKey="cpu" stroke="yellow" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="graph_panel">

                    <h2 className="panel_title">
                        CPU Only
                    </h2>
                    <ResponsiveContainer widht="100%" height={300}>
                        <AreaChart data={chartData}>
                            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />

                            <XAxis dataKey="time" stroke="#94a3b8" />

                            <YAxis hide />
                            <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155" }} />
                            <Area type="monotone" dataKey="cpu" stroke="#eab308" fill="#eab308" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>

                </div>

                <div>
                    {chartData.map((item, index) => (
                        <div key={index}>
                            Time:{item.time} | CPU: {item.cpu}
                        </div>
                    ))}
                </div>

                <div className="logs_panel">
                    <h2 className="panel_tittle">
                        RealTime logs
                    </h2>

                    {chartData.slice().reverse().map((item, index) => (
                        <div key={index} className="log_item">
                            Time: {item.time}{" | "}CPU: {item.cpu}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default FakeGraphChart