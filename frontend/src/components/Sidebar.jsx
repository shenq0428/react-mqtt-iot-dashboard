import { Link, useLocation } from "react-router-dom"
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';//for arrwow icon

function Sidebar({ menus, dashboardMenu, dashboardView, setDashboardView }) {

  const location = useLocation();

  const { user, setUser } = useContext(AuthContext);

  const [isDashboardSubmenuOpen, setIsDashboardSubmenuOpen] = useState(location.pathname.startsWith("/dashboard"));
  return (
    <div className="sidebar">

      <div className="user_card">
        <h3 style={{ marginBottom: 4, color: "cyan" }}>
          {user?.username || "GUEST"}
        </h3>

        <p>
          {user?.role || "Not Logged In"}
        </p>

        <small>
          {user?.company_name || ""}
        </small>
      </div>

      {menus.filter((menu) =>
        menu.roles.includes(user?.role || "guest"))
        .map((menu) => (
          <div key={menu.page}>

            {menu.page === "dashboard" ? (

              <div
                className="sidebar_link"
                onClick={() =>
                  setIsDashboardSubmenuOpen(
                    !isDashboardSubmenuOpen
                  )
                }
              >

                {menu.icon && (
                  <span style={{ marginRight: 6 }}>
                    {menu.icon}
                  </span>
                )}

                {menu.label}

                <span style={{ marginLeft: "auto" }}>
                  {isDashboardSubmenuOpen ? (
                    <i className="fa-solid fa-chevron-down"></i>
                  ) : (
                    <i className="fa-solid fa-chevron-right"></i>
                  )}
                </span>

              </div>

            ) : (

              <Link
                to={`/${menu.page}`}
                className={
                  location.pathname === `/${menu.page}`
                    ? "sidebar_link active"
                    : "sidebar_link"
                }
              >

                {menu.icon && (
                  <span style={{ marginRight: 6 }}>
                    {menu.icon}
                  </span>
                )}

                {menu.label}

              </Link>

            )}

            {/* dashboard submenu */}
            {menu.page === "dashboard" &&
              isDashboardSubmenuOpen && (

                <div className="dashboard_submenu">

                  {dashboardMenu.map((sub) => (

                    <Link
                      key={sub.key}

                      to={
                        sub.key
                          ? `/dashboard/${sub.key}`
                          : "/dashboard"
                      }

                      className={
                        (
                          sub.key === ""
                            ? location.pathname === "/dashboard"
                            : location.pathname === `/dashboard/${sub.key}`
                        )
                          ? "submenu_link active_submenu"
                          : "submenu_link"
                      }
                    >

                      {sub.label}

                    </Link>

                  ))}

                </div>

              )}

          </div>
        ))}


      <div className="login_logout_button">
        {!user ? (
          <Link to="/login" className="sidebar_link">
            Login
          </Link>) : (
          <Link to="/logout" className="sidebar_link">
            Logout
          </Link>
        )}
      </div>

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