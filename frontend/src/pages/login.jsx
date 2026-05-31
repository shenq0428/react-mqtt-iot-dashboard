import { useState, useContext } from "react";
import { loginUser, getCurrentUser } from "../services/authService";

import { AuthContext } from "../context/AuthContext";

function Login() {

    const { setUser } = useContext(AuthContext);

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
            console.log("LOGIN:", data);

            const users = await getCurrentUser();
            localStorage.setItem("user", JSON.stringify(users.user));
            console.log("USER:", users);

            const response = await getCurrentUser();
            setUser(response.user);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: "white" }}>Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />
            <button onClick={handleLogin}>
                Login
            </button>

        </div>
    );
}

export default Login;