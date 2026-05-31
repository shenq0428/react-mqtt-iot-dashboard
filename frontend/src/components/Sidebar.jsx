import { Link, useLocation } from "react-router-dom"
import { useContext } from "react";
  import { AuthContext } from "../context/AuthContext";

function Sidebar({
  menus,
  dashboardMenu,
  dashboardView,
  setDashboardView
}) {

  const location = useLocation();

  const { user } = useContext(AuthContext);
  
  return (
    <div className="sidebar">
      <div className="user_card">
        <h3>
          {user?.username || "GUEST"}
        </h3>
        <p>
          {user?.role || "Not Logged In"}
        </p>
        <small>
          {user?.company_name || ""}
        </small>

      </div>
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
      <div className="support_widget">

        <img
          src="/rocket.png"
          alt="rocket"
          className="support_rocket"
        />

        <h3 className="support_title">
          Need Help?
        </h3>

        <a
          href="https://wa.me/601116148101"
          target="_blank"
          className="support_button"
        >
          WhatsApp Support
        </a>

      </div>
    </div>
  )
}

export default Sidebar