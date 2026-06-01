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
import IwkDemoPage from './pages/dashboard/IwkDemoPage'
import Login from "./pages/login"
import Logout from "./pages/logout"
import Profile from "./pages/Profile.jsx";
import Diary from "./pages/Diary.jsx";

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [dashboardView, setDashboardView] = useState(null)

  const dashboardMenu = [
    {label: "Overview", key: "overview" },
    { label: "Testing", key: "testing" },
    { label: "Fake-Data", key: "fake-data" },
    { label: "fake-graphchart", key: "fake-graphchart" },
    { label: "MQTT-graphchart", key: "mqtt-graphchart" },
    { label: "IWK-Demo", key: "iwk-demo" },
    { label: "new-Label", key: "new-label" }
  ]

  const menuConfig = [
    { label: "Home", page: "", icon: "🏠", roles:["guest","user","admin","superadmin"] },
    { label: "Dashboard Overview", page: "dashboard", icon: "📊", roles:["guest","user","admin","superadmin"] },
    { label: "Settings", page: "settings", icon: "⚙️", roles:["user","admin","superadmin"] },
    { label: "AI Assistants", page: "ai-assistants", icon: "🤖", roles:["user","admin","superadmin"] },
    { label: "Profile", page: "profile", icon: "👤", roles:["user","admin","superadmin"] },
    { label: "Diary", page: "diary", icon: "📓", roles:["superadmin"] }
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
        menus={menuConfig}
        dashboardMenu={dashboardMenu}
        dashboardView={dashboardView}
        setDashboardView={setDashboardView}
      />

      <div className="main">
        <Routes>
          <Route path="/" element={<Overview />} />
          {/* Nested routes for dashboard sub-pages */}
          <Route path="/dashboard" element={<DashboardLayout />} >
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="testing" element={<TestingPage data={data} loading={loading} />} />
            <Route path="fake-data" element={<FakeDataPage />} />
            <Route path="fake-graphchart" element={<FakeGraphPage />} />
            <Route path="mqtt-graphchart" element={<MQTTPage />} />
            <Route path="iwk-demo" element={<IwkDemoPage/>} />
            <Route path="new-label" element={<h1>New Label Page</h1>} />
          </Route>
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-assistants" element={<AIAssistants />} />
          <Route path="/diary" element={<Diary />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>

    </div>
  )
}

export default App