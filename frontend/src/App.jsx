import { useState, useEffect } from 'react'
import "./App.css"
import Sidebar from './components/Sidebar'

import { Routes, Route } from "react-router-dom"
import Overview from "./pages/Overview"
import Settings from "./pages/Settings"
import AIAssistants from "./pages/AIAssistants"

import DashboardOverview from "./pages/dashboard/DashboardOverview"
import MQTTPage from "./pages/dashboard/MQTTPage"
import FakeDataPage from "./pages/dashboard/FakeDataPage"
import TestingPage from "./pages/dashboard/TestingPage"
import FakeGraphPage from "./pages/dashboard/FakeGraphPage"
import DashboardLayout from "./pages/dashboard/DashboardLayout"

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [dashboardView, setDashboardView] = useState(null)

  const dashboardMenu = [
    { label: "Testing", key: "testing" },
    { label: "Fake-Data", key: "fake-data" },
    { label: "fake-graphchart", key: "fake-graphchart" },
    { label: "MQTT-graphchart", key: "mqtt-graphchart" },
    { label: "IWK-Demo", key: "iwk" },
    { label: "new-Label", key: "new-label" }
  ]

  const menus = [
    { label: "Home", page: "", icon: "🏠" },
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

  return (
    <div className="layout">

      <Sidebar
        menus={menus}
        dashboardMenu={dashboardMenu}
        dashboardView={dashboardView}
        setDashboardView={setDashboardView}
      />

      <div className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          {/* Nested routes for dashboard sub-pages */}
          <Route path="/dashboard/*" element={<DashboardLayout data={data} loading={loading} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-assistants" element={<AIAssistants />} />
        </Routes>
      </div>

    </div>
  )
}

export default App