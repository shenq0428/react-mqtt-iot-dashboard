import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import "./LoginLogout.css";

function Logout() {

    const { user, setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [confirmLogout, setConfirmLogout] = useState(false);

    const handleLogout = async () => {

        try {
            await logoutUser();

            //为了避免token expire而logout不到 而使用finally 不管Jwt有没有过期都能推出，但是代价是logoutaudit不会记录 因为jwttoken过期了
        } catch (error) {

            console.log(               "Logout audit skipped"
            );

        } finally {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            setUser(null);

            navigate("/login");
        }
    };


    return (
        <div className="auth_container">

            <div className="auth_card">

                <h1 className="auth_logo">
                    🦞 Nova Lobster
                </h1>

                <p className="auth_subtitle">
                    Terminate Current Session
                </p>

                <div className="logout_info">
                    <p>
                        User:
                        <strong>
                            {" "}
                            {user?.username}
                        </strong>
                    </p>

                    <p>
                        Role:
                        <strong>
                            {" "}
                            {user?.role}
                        </strong>
                    </p>

                </div>

                {!confirmLogout ? (
                    //!confimm logout not equal to true show normal button if confirm logout is true show warning button
                    <button className="auth_button" onClick={() => setConfirmLogout(true)}>
                        🙁 TERMINATE SESSION
                    </button>
                ) : (
                    <button className="auth_button warning" onClick={handleLogout}>
                        (╥﹏╥) CLICK AGAIN TO CONFIRM
                    </button>
                )}

                <button className="auth_secondary_button" onClick={() => navigate("/")}           >
                    😋 CANCEL
                </button>
            </div>
        </div>
    );
}

export default Logout;