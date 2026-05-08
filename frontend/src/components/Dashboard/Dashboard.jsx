import FakeData from "./FakeData"
import Testing from "./Testing"
import FakeGraphChart from "./FakeGraphChart"

function Dashboard({ dashboardView, data, loading }) {

  function renderContent() {
    if (dashboardView === null) {
      return <><h3>Dashboard Main Page</h3>
        <p>will add search of button function in the future</p>
      </>
    }

    if (dashboardView === "testing") { return <Testing data={data} loading={loading} /> }
    if (dashboardView === "fake-data") return <FakeData />
    if (dashboardView === "fake-graphchart")return <FakeGraphChart/>
    if (dashboardView === "iwk") return <h2>IWK Demo</h2>

    return <h2>New Label</h2>
  }

  return (
    <div className="dashboard">
      {renderContent()}
    </div>
  )
}

export default Dashboard