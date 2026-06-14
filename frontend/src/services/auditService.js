import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/audit-logs`;

export const getAuditLogs =
  async (page=1, limit=15, action = "") => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.get(
            `${API_URL}?page=${page}&limit=${limit}&action=${action}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};