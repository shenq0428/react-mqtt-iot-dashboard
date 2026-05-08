import { useState, useEffect } from 'react'
import "./App.css"
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard/Dashboard'

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState("dashboard")
  const [dashboardView, setDashboardView] = useState(null)

  const dashboardMenu = [
    { label: "Testing", key: "testing" },
    { label: "Fake Data", key: "fake-data" },
    {label:"fake graphchart",key:"fake-graphchart"},
    {label:"MQTT graphchart",key:"mqtt-graphchart"},
    { label: "IWK Demo", key: "iwk" },
    { label: "new Label", key: "new label" }
  ]

  const menus = [
    { label: "Home", page: "home", icon: "🏠" },
    { label: "Dashboard", page: "dashboard", icon: "📊" },
    { label: "Settings", page: "settings", icon: "⚙️" },
    { label: "AI Assistants", page: "ai-assistants", icon: "🤖" }
  ]

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5")
      .then(res => res.json())
      .then(data => {
        setData(data)
        setLoading(false)
      })
  }, [])

  // ✅ 页面渲染函数（干净很多）
  function renderPage() {
    if (page === "dashboard") {
      return (
        <Dashboard
          dashboardView={dashboardView}
          data={data}
          loading={loading}
        />
      )
    }

    if (page === "settings") {
      return <h1>Settings</h1>
    }

    if (page === "ai-assistants") {
      return <h1>AI Assistants</h1>
    }

    return <h1>Home</h1>
  }

  return (
    <div className="layout">

      <Sidebar
        menus={menus}
        page={page}
        setPage={setPage}
        dashboardMenu={dashboardMenu}
        dashboardView={dashboardView}
        setDashboardView={setDashboardView}
      />

      <div className="main">
        {renderPage()}
      </div>

    </div>
  )
}

export default App