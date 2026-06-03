import { useState, useEffect } from 'react'
import "./App.css"
import Sidebar from './components/Sidebar'
import Navbar from "./components/Navbar";

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
import UserManagement from "./pages/UserManagement.jsx";
import AccountManagement from "./pages/AccountManagement.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const [dashboardView, setDashboardView] = useState(null)

  const dashboardMenu = [
    { label: "Overview", key: "overview" },
    { label: "Testing", key: "testing" },
    { label: "Fake-Data", key: "fake-data" },
    { label: "fake-graphchart", key: "fake-graphchart" },
    { label: "MQTT-graphchart", key: "mqtt-graphchart" },
    { label: "IWK-Demo", key: "iwk-demo" },
    { label: "new-Label", key: "new-label" }
  ]

  const menuConfig = [
    { label: "Home", page: "", icon: "🏠", roles: ["guest", "user", "admin", "superadmin"] },
    { label: "Dashboard Overview", page: "dashboard", icon: "📊", roles: ["guest", "user", "admin", "superadmin"] },
    { label: "AI Assistants", page: "ai-assistants", icon: "🤖", roles: ["user", "admin", "superadmin"] },
    { label: "Audit Logs", page: "audit-logs", icon: "📜", roles: ["superadmin"] },
    { label: "User Management", page: "user-management", icon: "🧑‍💻", roles: ["admin", "superadmin"] },
    { label: "Company Management", page: "account-management", icon: "📝", roles: ["superadmin"] },
    { label: "Diary", page: "diary", icon: "📓", roles: ["superadmin"] },
    { label: "Profile", page: "profile", icon: "👤", roles: ["user", "admin", "superadmin"] },
    { label: "Settings", page: "settings", icon: "⚙️", roles: ["admin", "superadmin"] },
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
          setDashboardView={setDashboardView}
        />
        <div className="content">
          <Navbar />
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
              <Route path="iwk-demo" element={<IwkDemoPage />} />
              <Route path="new-label" element={<h1>New Label Page</h1>} />
            </Route>
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-assistants" element={<AIAssistants />} />
            <Route path="/diary" element={<ProtectedRoute allowedRoles={["superadmin"]}><Diary /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}><Profile /></ProtectedRoute>} />
            <Route path="audit-logs" element={<ProtectedRoute allowedRoles={["superadmin"]}><AuditLogs /></ProtectedRoute>} />
            <Route path="user-management" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><UserManagement /></ProtectedRoute>} />
            <Route path="account-management" element={<ProtectedRoute allowedRoles={["superadmin"]}><AccountManagement /></ProtectedRoute>} >
              <Route path="view users" element={<h1>View Users</h1>} />
              <Route path="add user" element={<h1>Add User</h1>} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App