import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {

    const { user } =
        useContext(AuthContext);

    return (
        <div>

            <h1>
                Profile
            </h1>

            <p>
                Username:{user?.username}
            </p>

            <p>
                Email: {user?.email}
            </p>

            <p>
                Role:  {user?.role}
            </p>

            <p>
                Company: {user?.company_name}
            </p>

        </div>
    );
}

export default Profile;