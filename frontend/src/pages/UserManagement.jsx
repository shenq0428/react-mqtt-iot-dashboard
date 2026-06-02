import { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import './UserManagement.css';

function UserManagement() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {

    const loadUsers = async () => {

      const data = await getUsers();

      console.log(data);

      setUsers(data);
    };


    loadUsers();

  }, []);

  console.log("USERS:", users);
  return (
     <div className="user_management_container">

      <h1 className="user_management_title">User Management Page</h1>
      <input className="user_search" type="text" placeholder="Insert Username to Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table className="user_table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td><span className={`role_badge ${user.role}`}>{user.role}</span></td>
              <td>
                <span className="status_badge active">ACTIVE</span>
              </td>
              <td>
                <button className="edit_button">EDIT</button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>);
}

export default UserManagement;