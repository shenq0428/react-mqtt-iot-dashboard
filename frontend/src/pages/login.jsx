import { useState, useContext } from "react";
import { loginUser, getCurrentUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import "./LoginLogout.css";

function Login() {

    const { setUser } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const data = await loginUser(
                email,
                password
            );

            localStorage.setItem(
                "token",
                data.token
            );

            console.log(
                "LOGIN:",
                data
            );

            const userData = await getCurrentUser();

            localStorage.setItem("user", JSON.stringify(userData.user));

            setUser(userData.user);

            console.log(
                "USER:",
                userData
            );

            navigate("/");

        } catch (err) {
            console.error(err);
        }
    };

    return (

        <div className="auth_container">
            <div className="auth_card">

                <h1 className="auth_logo">
                    🦞 Nova Lobster
                </h1>

                <p className="auth_subtitle">
                    Industrial Monitoring Platform
                </p>

                <input type="email" placeholder="Email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input type="password" placeholder="Password" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="auth_button" onClick={handleLogin}>
                    CONNECT
                </button>
            </div>
        </div>
    );
}

export default Login;