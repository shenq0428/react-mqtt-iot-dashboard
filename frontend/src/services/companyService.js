import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/companies`;

export const getCompanies = async () => {

    const token = localStorage.getItem("token");

    const response = await axios.get(
        API_URL,
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );

    return response.data;
};

export const getCompanyById = async (id) => {

    const token = localStorage.getItem("token");

    const response = await axios.get(
        `${API_URL}/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const createCompany = async (companyData) => {

    const token = localStorage.getItem("token");

    const response = await axios.post(
        API_URL,
        companyData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const updateCompany = async ( id, companyData) => {

    const token = localStorage.getItem("token");

    const response = await axios.patch(

        `${API_URL}/${id}`,

        companyData,

        {
            headers: {
                Authorization:
                    `Bearer ${token}`
            }
        }

    );

    return response.data;
};

export const deleteCompany = async (id) => {

    const token = localStorage.getItem("token");

    const response = await axios.delete(

        `${API_URL}/${id}`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    );

    return response.data;
};