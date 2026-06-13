import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/dashboard`;

export const getDashboardStats =
  async () => {

    const token =
      localStorage.getItem("token");

    const response =
      await axios.get(
        `${API_URL}/stats`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
};

export const getRecentActivities = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/recent-activities`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getRecentLoginActivities = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/recent-login-activities`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getUserGrowth = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/user-growth`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};

export const getAuditSummary = async () => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/audit-summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
};