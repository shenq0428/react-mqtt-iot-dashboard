// services/userService.js
//userService 的本质就是帮 React 包装 API 请求。
/*crud原理 create 要userdata parameter然后通过点击fetch的原理上传， 
get什么parameter都不用 只是需要读取localstorage的token, 
update就需要id 和status的parameter 因为会根据id来知道修改哪个status, 
delete 需要id 因为是根据id来知道delete哪一行的数据。*/

import axios from "axios";

const API_URL = "http://localhost:3001/api/users";

export const createUser = async (userData) => {
  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:3001/api/users",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(userData),
    }
  );

  return await response.json();
};

export const getUsers = async () => {

  const token = localStorage.getItem("token");

  const response =
    await axios.get(
      API_URL,
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
      `${API_URL}/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  return response.data;
}

export const deleteUser = async (id) => {
  const token = localStorage.getItem("token");
  const response =
    await axios.delete(
      `${API_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  return response.data;
}