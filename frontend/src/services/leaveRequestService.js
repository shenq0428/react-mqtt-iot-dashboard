import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/leave-requests`;

const getAuthConfig = () => {

    const token = localStorage.getItem("token");

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

};

export const getMyLeaveRequests = async () => {

    const response = await axios.get(
        `${API_URL}/my`,
        getAuthConfig()
    );

    return response.data;

};

export const getAllLeaveRequests = async () => {
    const response = await axios.get(
        API_URL,
        getAuthConfig()
    );

    return response.data;
};

export const getLeaveRequestById = async (id) => {

    const response = await axios.get(
        `${API_URL}/${id}`,
        getAuthConfig()
    );

    return response.data;
};

export const createLeaveRequest = async (leaveData) => {

    const response = await axios.post(
        API_URL,
        leaveData,
        getAuthConfig()
    );

    return response.data;

};

export const updateLeaveRequest = async (id, leaveData) => {

    const response = await axios.put(
        `${API_URL}/${id}`,
        leaveData,
        getAuthConfig()
    );

    return response.data;

};

export const updateLeaveRequestStatus = async (id, statusData) => {
    const response = await axios.patch(
        `${API_URL}/${id}/status`,
        statusData,
        getAuthConfig()
    );

    return response.data;
};

export const cancelLeaveRequest = async (id) => {

    const response = await axios.patch(
        `${API_URL}/${id}/cancel`,
        {},
        getAuthConfig()
    );

    return response.data;

};