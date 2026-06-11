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
    </div>
                <p>Realtime MQTT Monitoring System</p>

            
            <div className="dashboard_tabs">
                <NavLink to="/developer-playground/testing" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    Testing</NavLink>
                <NavLink to="/developer-playground/fake-data" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    Fake Data</NavLink>
                <NavLink to="/developer-playground/fake-graphchart" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    Fake Graph</NavLink>
                <NavLink to="/developer-playground/mqtt-graphchart" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    MQTT Graph</NavLink>
                <NavLink to="/developer-playground/iwk-demo" className={({ isActive }) => isActive ? "dashboard_tab active_dashboard_tab" : "dashboard_tab"}>
                    IWK Demo</NavLink>
            </div>

            <Outlet />

        </div>

    )

}

export default DashboardLayout