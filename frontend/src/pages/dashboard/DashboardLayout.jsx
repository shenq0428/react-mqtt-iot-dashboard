import { Routes, Route } from "react-router-dom"

import DashboardOverview from "./DashboardOverview"
import TestingPage from "./TestingPage"
import FakeDataPage from "./FakeDataPage"
import MQTTPage from "./MQTTPage"
import FakeGraphPage from "./FakeGraphPage"

function DashboardLayout({ data, loading }) {

    return (

        <Routes>

            <Route path="/" element={<DashboardOverview />} />
            <Route path="testing" element={<TestingPage data={data} loading={loading} />} />
            <Route path="fake-data" element={<FakeDataPage />} />
            <Route path="fake-graphchart" element={<FakeGraphPage />} />
            <Route path="mqtt-graphchart" element={<MQTTPage />} />
            <Route path="iwk" element={<h1>IWK Page</h1>} />
            <Route path="new-label" element={<h1>New Label Page</h1>} />

        </Routes>

    )

}

export default DashboardLayout