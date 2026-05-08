import { useEffect, useState } from "react"

function FakeData() {

  const [chartData, setChartData] = useState([])
  const [counter, setCounter] = useState(1)

  useEffect(() => {

    const interval = setInterval(() => {

      const newData = {
        id: counter,
        time: new Date().toLocaleTimeString(),
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 20) + 40,
        cpu: Math.floor(Math.random() * 50) + 10
      }
      setChartData(prev => {
        const updateData = [...prev, newData]

        if (updateData.length > 20) {
          updateData.shift()
        }
        return updateData
      })

      setCounter(prev => prev + 1)

    }, 2000)
    return () => clearInterval(interval)

  }, [counter])

  return (
    <div>
      <h2>Fake Time Series Dashboard</h2>

      {chartData.map((item, index) => (
        <div key={index}>
          {item.id} | {item.time} | Temp: {item.temperature} | Humidity: {item.humidity} | CPU: {item.cpu}
        </div>
      ))}
    </div>
  )
}
export default FakeData