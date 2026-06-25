import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/leave-requests`;

export const getMyLeaveRequests =  async () => {

        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/my`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        return response.data;

    };


export const createLeaveRequest = async (leaveData) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        leaveData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};