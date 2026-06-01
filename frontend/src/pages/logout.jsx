import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Logout() {

  const { setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (

    <div>

      <h1>Logout</h1>

      <p>
        Are you sure you want to logout?
      </p>

      {!confirmLogout ? (

        <button
          onClick={() => setConfirmLogout(true)}
        >
          🚪 Logout
        </button>

      ) : (

        <button
          onClick={handleLogout}
        >
          ⚠️ Click Again To Confirm Logout
        </button>

      )}

      <button
        onClick={() => navigate("/")}
      >
        Cancel
      </button>

    </div>

  );
}

export default Logout;