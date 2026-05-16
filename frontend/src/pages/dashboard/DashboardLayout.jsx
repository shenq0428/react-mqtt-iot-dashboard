import { Routes, Route } from "react-router-dom"
import { Outlet } from "react-router-dom"

import DashboardOverview from "./DashboardOverview"
import TestingPage from "./TestingPage"
import FakeDataPage from "./FakeDataPage"
import MQTTPage from "./MQTTPage"
import FakeGraphPage from "./FakeGraphPage"

function DashboardLayout({ data, loading }) {

    return (

        <div className="dashboard_layout">

            <div className="dashboard_header">

                <h1>IoT Dashboard</h1>

                <p>Realtime MQTT Monitoring System</p>

            </div>

            <Outlet />

        </div>

    )

}

export default DashboardLayout