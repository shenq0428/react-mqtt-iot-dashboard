import { Link } from "react-router-dom"

function Sidebar({
  menus,
  dashboardMenu,
  dashboardView,
  setDashboardView
}) {

  return (

    <div className="sidebar">

      {menus.map((menu) => (

        <div key={menu.page}>

          <Link
            to={`/${menu.page}`}
            className="sidebar_link"
          >

            {menu.icon && (
              <span style={{ marginRight: 6 }}>
                {menu.icon}
              </span>
            )}

            {menu.label}

          </Link>

          {/* dashboard submenu later */}

        </div>

      ))}

    </div>

  )

}

export default Sidebar