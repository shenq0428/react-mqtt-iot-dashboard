import axios from "axios";

const API_URL = "http://localhost:3001/api/auth";

export const loginUser = async (email, password) => {
    const response = await axios.post(
        `${API_URL}/login`,
        //same as http://localhost:3001/api/auth/login
        {
            email,
            password,
        }
    );
    return response.data;
};

export const getCurrentUser = async () => {

    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/me`,
        {
            headers: { Authorization: `Bearer ${token}`, },
        }
    );
    return response.data;
};