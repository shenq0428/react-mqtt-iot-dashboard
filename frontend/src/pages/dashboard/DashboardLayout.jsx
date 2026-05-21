import { Routes, Route } from "react-router-dom"
import { Outlet, NavLink } from "react-router-dom"

import DashboardOverview from "./DashboardOverview"
import TestingPage from "./TestingPage"
import FakeDataPage from "./FakeDataPage"
import MQTTPage from "./MQTTPage"
import FakeGraphPage from "./FakeGraphPage"
import IwkDemoPage from "./IwkDemoPage"

function DashboardLayout({ data, loading }) {

    return (

        <div className="dashboard_layout">

            <div className="dashboard_header">
                <div className="corner_dot top_left"></div>
                <div className="corner_dot top_right"></div>
                <div className="corner_dot bottom_left"></div>
                <div className="corner_dot bottom_right"></div>

                <h1>Nova Lobster IoT Dashboard</h1>

                <p>Realtime MQTT Monitoring System</p>

            </div>
            <div className="dashboard_tabs">
                <NavLink to="/dashboard" className="dashboard_tab" >
                    Overview</NavLink>
                <NavLink to="/dashboard/testing" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    Testing</NavLink>
                <NavLink to="/dashboard/fake-data" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    Fake Data</NavLink>
                <NavLink to="/dashboard/fake-graphchart" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    Fake Graph</NavLink>
                <NavLink to="/dashboard/mqtt-graphchart" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    MQTT Graph</NavLink>
                <NavLink to="/dashboard/iwk-demo" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    IWK Demo</NavLink>
                <NavLink to="/dashboard/new-label" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    New Label</NavLink>
            </div>

            <Outlet />

        </div>

    )

}

export default DashboardLayout