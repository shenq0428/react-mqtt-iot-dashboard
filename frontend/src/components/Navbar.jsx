import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {

  const location = useLocation();

  const { user } = useContext(AuthContext);

  const pageTitles = {
    "/": "Home",
    "/settings": "Settings",
    "/profile": "Profile",
    "/diary": "Diary",
    "/user-management": "User Management",
    "/company-management": "Company Management",
    "/audit-logs": "Audit Logs",
    "/dashboard": "Dashboard Overview",
    "/dashboard/overview": "Dashboard Overview",
    "/ai-assistants": "AI Assistants",
    "/login": "Login",
    "/logout": "Logout",
    "/dashboard/testing": "Dashboard Overview/ Testing",
    "/dashboard/fake-data": "Dashboard Overview/ Fake Data",
    "/dashboard/fake-graphchart": "Dashboard Overview/ Fake Graph Chart",
  };

  const currentTitle =
    pageTitles[location.pathname] || "Nova Lobster";

  return (

    <div className="navbar">

      {/* Center */}
      <div className="navbar_title">
        <i className="fa-solid fa-bars-staggered"></i>
        {currentTitle}
      </div>

      {/* Right */}
      <div className="navbar_user">

        <div className="navbar_username">
          {user?.username || "Guest"}
        </div>

        <div className="navbar_role">
          {user?.role || "Not Logged In"}
        </div>

      </div>

    </div>

  );
}

export default Navbar;