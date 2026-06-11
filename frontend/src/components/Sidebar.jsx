import { Link, useLocation } from "react-router-dom"
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import '@fortawesome/fontawesome-free/css/all.min.css';//for arrwow icon

function Sidebar({ menus, developerMenu, }) {

  const location = useLocation();

  const { user } = useContext(AuthContext);

  const [isDeveloperSubmenuOpen, setIsDeveloperSubmenuOpen] = useState(location.pathname.startsWith("/developer-playground"));

  const isDeveloperPage = location.pathname.startsWith("/developer-playground");



  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <div className="sidebar_logo">
          🦞 Nova Lobster
        </div>
      </div>
      <div className="sidebar_menu">
        {menus.filter((menu) =>
          menu.roles.includes(user?.role || "guest"))
          .map((menu) => (
            <div key={menu.page}>

              {menu.page === "developer-playground" ? (

                <div
                  className={isDeveloperPage ? "sidebar_link active" : "sidebar_link"}
                  onClick={() => setIsDeveloperSubmenuOpen(!isDeveloperSubmenuOpen )}
                >

                  {menu.icon && (<span style={{ marginRight: 6 }}>            {menu.icon}       </span>)}

                  {menu.label}

                  <span style={{ marginLeft: "auto" }}>
                    {isDeveloperSubmenuOpen ? (
                      <i className="fa-solid fa-chevron-down"></i>
                    ) : (
                      <i className="fa-solid fa-chevron-right"></i>
                    )}
                  </span>

                </div>

              ) : (

                <Link to={`/${menu.page}`} className={location.pathname === `/${menu.page}` ? "sidebar_link active" : "sidebar_link"}  >

                  {menu.icon && (<span style={{ marginRight: 6 }}>  {menu.icon} </span>)}

                  {menu.label}

                </Link>

              )}

              {/* developer playground submenu */}
              {menu.page === "developer-playground" &&
                isDeveloperSubmenuOpen && (

                  <div className="dashboard_submenu">

                    {developerMenu.map((sub) => (

                      <Link
                        key={sub.key}

                        to={
                          sub.key
                            ? `/developer-playground/${sub.key}`
                            : "/developer-playground"
                        }

                        className={(sub.key === ""
                          ? location.pathname === "/developer-playground"
                          : location.pathname === `/developer-playground/${sub.key}`)
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

        <div className="login_logout_button">
          {!user ? (
            <Link to="/login" className="sidebar_link">
              Login
            </Link>
          ) : (
            <Link to="/logout" className="sidebar_link" style={{ color: "red" }}>
              😭Logout
            </Link>
          )}
        </div>
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