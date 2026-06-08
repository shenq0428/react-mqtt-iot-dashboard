// services/userService.js
//userService 的本质就是帮 React 包装 API 请求。
/*crud原理 create 要userdata parameter然后通过点击fetch的原理上传， 
get什么parameter都不用 只是需要读取localstorage的token, 
update就需要id 和status的parameter 因为会根据id来知道修改哪个status, 
delete 需要id 因为是根据id来知道delete哪一行的数据。*/

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const USER_URL = `${BASE_URL}/api/users`;
const COMPANY_URL = `${BASE_URL}/api/companies`;

export const createUser = async (userData) => {

  const token = localStorage.getItem("token");

  const response =
    await axios.post(
      USER_URL,
      userData,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  return response.data;
};

export const getUsers = async () => {

  const token = localStorage.getItem("token");

  const response =
    await axios.get(
      USER_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const token = localStorage.getItem("token");
  const response =
    await axios.patch(
      `${USER_URL}/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  return response.data;
};

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const response =
    await axios.delete(
      `${USER_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  return response.data;
};

export const getCompanies = async () => {

  const token = localStorage.getItem("token");

  const response =
    await axios.get(
      COMPANY_URL,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  return response.data;
};

export const updateUser = async (id, payload) => {

  const token = localStorage.getItem("token");

  const response =
    await axios.patch(
      `${USER_URL}/${id}`,
      payload,
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

  return response.data;
};