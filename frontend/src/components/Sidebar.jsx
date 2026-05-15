import { Link, useLocation } from "react-router-dom"

function Sidebar({
  menus,
  dashboardMenu,
  dashboardView,
  setDashboardView
}) {
  const location = useLocation()
  return (

    <div className="sidebar">

      {menus.map((menu) => (

        <div key={menu.page}>

          <Link
            to={`/${menu.page}`}
            className={location.pathname === `/${menu.page}` ? "sidebar_link active" : "sidebar_link"}>

            {menu.icon && (
              <span style={{ marginRight: 6 }}>
                {menu.icon}
              </span>
            )}

            {menu.label}

          </Link>

          {/* dashboard submenu later */}
          {menu.page === "dashboard" && location.pathname.startsWith("/dashboard") && (

            <div className="dashboard_submenu">

              {dashboardMenu.map((sub) => (

                <Link
                  key={sub.key}
                  to={`/dashboard/${sub.key}`}
                  className={location.pathname === `/dashboard/${sub.key}` 
                  ? "submenu_link active_submenu" 
                  : "submenu_link"}
                >

                  {sub.label}

                </Link>

              ))}

            </div>

          )}
        </div>

      ))}

    </div>

  )

}

export default Sidebar