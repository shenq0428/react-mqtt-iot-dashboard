function Sidebar({
  menus,
  page,
  setPage,
  dashboardMenu,
  dashboardView,
  setDashboardView
}) {
  return (
    <div className="sidebar">
      {menus.map(menu => (
        <div key={menu.page}>

          <p
            className={page === menu.page ? "active" : ""}
            onClick={() => {
              setPage(menu.page)

              if (menu.page === "dashboard") {
                setDashboardView(null)
              }
            }}
          >
            {menu.icon && <span style={{ marginRight: 6 }}>{menu.icon}</span>}
            {menu.label}
          </p>

          {/* Dashboard submenu */}
          {menu.page === "dashboard" && page === "dashboard" && (
            <div className="dashboard_submenu">
              {dashboardMenu.map(sub => (
                <p
                  key={sub.key}
                  className={dashboardView === sub.key ? "active_submenu" : ""}
                  onClick={() => setDashboardView(sub.key)}
                >
                  {sub.label}
                </p>
              ))}
            </div>
          )}

        </div>
      ))}
    </div>
  )
}

export default Sidebar
