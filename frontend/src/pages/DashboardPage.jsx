import Dashboard from "../components/Dashboard/Dashboard"

function DashboardPage({
  dashboardView,
  data,
  loading,
}) {

  return (

    <Dashboard
      dashboardView={dashboardView}
      data={data}
      loading={loading}
    />

  )

}

export default DashboardPage