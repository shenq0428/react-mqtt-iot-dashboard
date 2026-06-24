import { useState, useEffect } from 'react'
import "./App.css"
import Sidebar from './components/Sidebar'
import Navbar from "./components/Navbar";

import { Routes, Route } from "react-router-dom"
import DeveloperCheatSheet from "./pages/DeveloperCheatSheet.jsx";
import Settings from "./pages/Settings"
import AIAssistants from "./pages/AIAssistants"

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
import CompanyManagement from "./pages/CompanyManagement.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import CompanyDetails from "./pages/CompanyDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from './pages/AdminDashboard.jsx';
import LeaveRequests from "./pages/LeaveRequests.jsx";
import ClaimRequests from "./pages/ClaimRequests.jsx";
import Outsite from "./pages/Outsite.jsx";
import Calendar from "./pages/Calendar.jsx";
import Notification from './pages/Notification.jsx';

function App() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  const developerMenu = [
    { label: "Testing", key: "testing" },
    { label: "Fake Data", key: "fake-data" },
    { label: "Fake Graph", key: "fake-graphchart" },
    { label: "MQTT Dashboard", key: "mqtt-graphchart" },
    { label: "IWK Demo", key: "iwk-demo" },
    { label: "AI Assistants", key: "ai-assistants" },
    { label: "Diary", key: "diary" },
  ]

  const menuConfig = [
    { label: "Admin Dashboard", page: "admin-dashboard", icon: "📊", roles: ["superadmin"] },
    { label: "User Management", page: "user-management", icon: "🧑‍💻", roles: ["admin", "superadmin"] },
    { label: "Company Management", page: "company-management", icon: "🏢", roles: ["superadmin"] },
    { label: "Audit Logs", page: "audit-logs", icon: "📜", roles: ["superadmin"] },
    // Employee Portal
    { label: "Leave Requests", page: "leave-requests", icon: "🏖️", roles: ["user", "admin", "company_super_admin", "superadmin"] },
    { label: "Claim Requests", page: "claim-requests", icon: "🧾", roles: ["user", "admin", "company_super_admin", "superadmin"] },
    { label: "Outsite", page: "outsite", icon: "🚗", roles: ["user", "admin", "company_super_admin", "superadmin"] },
    { label: "Calendar", page: "calendar", icon: "📅", roles: ["user", "admin", "company_super_admin", "superadmin"] },
    { label: "Notification", page: "notification", icon: "!!!", roles: ["user", "admin", "company_super_admin", "superadmin"] },

    { label: "Profile", page: "profile", icon: "👤", roles: ["user", "admin", "superadmin"] },
    { label: "Settings", page: "settings", icon: "⚙️", roles: ["admin", "superadmin"] },
    ...(import.meta.env.DEV ? [{ label: "Developer Playground", page: "developer-playground", icon: "🧪", roles: ["superadmin"] }] : []),
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
        developerMenu={developerMenu}
      />
      <div className="content">
        <Navbar />
        <div className="main">
          <Routes>
            <Route path="/" element={<DeveloperCheatSheet />} />
            {/* Nested routes for dashboard sub-pages */}
            <Route path="/developer-playground" element={<DashboardLayout />} >
              <Route index element={<div><h1>Developer Playground</h1><p>Select a page from sidebar</p></div>} />
              <Route path="testing" element={<TestingPage data={data} loading={loading} />} />
              <Route path="fake-data" element={<FakeDataPage />} />
              <Route path="fake-graphchart" element={<FakeGraphPage />} />
              <Route path="mqtt-graphchart" element={<MQTTPage />} />
              <Route path="iwk-demo" element={<IwkDemoPage />} />
              <Route path="ai-assistants" element={<ProtectedRoute allowedRoles={["superadmin"]}><AIAssistants /></ProtectedRoute>} />
              <Route path="diary" element={<ProtectedRoute allowedRoles={["superadmin"]}><Diary /></ProtectedRoute>} />
            </Route>
            <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={["superadmin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={["user", "admin", "superadmin"]}><Profile /></ProtectedRoute>} />
            <Route path="audit-logs" element={<ProtectedRoute allowedRoles={["superadmin"]}><AuditLogs /></ProtectedRoute>} />
            <Route path="user-management" element={<ProtectedRoute allowedRoles={["admin", "superadmin"]}><UserManagement /></ProtectedRoute>} />
            <Route path="/company-management" element={<ProtectedRoute allowedRoles={["superadmin"]}><CompanyManagement /></ProtectedRoute>} />
            <Route path="/company-management/:id" element={<ProtectedRoute allowedRoles={["superadmin"]}><CompanyDetails /></ProtectedRoute>} />
            <Route path="/leave-requests" element={<ProtectedRoute allowedRoles={["user", "admin", "company_super_admin", "superadmin"]}   > <LeaveRequests /> </ProtectedRoute>} />
            <Route path="/claim-requests" element={<ProtectedRoute allowedRoles={["user", "admin", "company_super_admin", "superadmin"]} > <ClaimRequests /></ProtectedRoute>} />
            <Route path="/outsite" element={<ProtectedRoute allowedRoles={["user", "admin", "company_super_admin", "superadmin"]}> <Outsite /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute allowedRoles={["user","admin","company_super_admin", "superadmin" ]}>  <Calendar /></ProtectedRoute> }/>
            <Route path="/notification" element={<ProtectedRoute allowedRoles={["user","admin","company_super_admin", "superadmin" ]}>  <Notification /></ProtectedRoute> }/>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default App