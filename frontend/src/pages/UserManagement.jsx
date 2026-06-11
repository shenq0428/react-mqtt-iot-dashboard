import { useEffect, useState, Fragment, useContext } from "react";
import { getUsers, updateUserStatus, deleteUser, createUser, getCompanies, updateUser } from "../services/userService.js";
import './UserManagement.css';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";

function UserManagement() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUsers, setEditedUsers] = useState({});
  const [pendingStatus, setPendingStatus] = useState({});

  const [updatingUserId, setUpdatingUserId] = useState(null);
  //use for delete confirmation
  const [deleteUserId, setDeleteUserId] = useState(null);
  //用来生成createuser 弹窗
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  //creater user panel 内容
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [privilegeType, setPrivilegeType] = useState("permanent");
  const [expiresAt, setExpiresAt] = useState("");
  //显示密码与否
  const [showPassword, setShowPassword] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");
  //company fake data
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  //display create account message
  const [message, setMessage] = useState("");
  //frontend validation
  const [errors, setErrors] = useState({});


  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
    || user.company_name?.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {

    const loadUsers = async () => {
      //getUsers function from services/userService.js will call the backend API to get the list of users, and then set the users state with the data returned from the backend
      //就是这里通过前端的getUsers里的userservice来跟后端的userRoutes.js里的getUsers函数来交互，拿到用户列表数据的
      const data = await getUsers();
      console.log(data);
      setUsers(data);
    };

    //读取company
    const loadCompanies = async () => {

      const data = await getCompanies();
      console.log("COMPANIES:", data);
      setCompanies(data);
    };

    loadUsers();
    loadCompanies();

  }, []);

  //console.log("USERS:", users);
  return (
    <div className="user_management_container">

      <h1 className="user_management_title">User Management Page</h1>
      <input className="user_search" type="text" placeholder="Insert Username to Search" value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="user_management_header">
        <div className="user_count">
          Total Users:🔍 {filteredUsers.length}
        </div>

        <div className="create_panel">
          <button className="create_user_btn" onClick={() => setShowCreatePanel(true)}>  ➕👤 Create User</button>
        </div>
      </div>

      <table className="user_table">

        <thead>
          <tr>
            <th>#</th>
            <th>Database ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Company</th>
            <th>Role</th>
            <th>Type</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user, index) => (
            <Fragment key={user.id}>
              <tr>

                <td>{index + 1}</td>
                <td>{user.id}</td>

                <td>{updatingUserId === user.id
                  ? (<input type="text" value={editedUsers[user.id]?.username || ""} onChange={(e) => setEditedUsers({
                    ...editedUsers, [user.id]
                      : { ...editedUsers[user.id], username: e.target.value }
                  })} />)
                  : (user.username)}</td>

                <td>{updatingUserId === user.id
                  ? (<input type="email" value={editedUsers[user.id]?.email || ""} onChange={(e) => setEditedUsers({
                    ...editedUsers,
                    [user.id]
                      : { ...editedUsers[user.id], email: e.target.value }
                  })} />)
                  : (user.email)}</td>

                <td>{updatingUserId === user.id ? (currentUser?.role === "superadmin" ?(
                  <select value={editedUsers[user.id]?.company_id || ""} onChange={(e) => setEditedUsers({
                    ...editedUsers,
                    [user.id]:
                    {
                      ...editedUsers[user.id],
                      company_id: Number(e.target.value)
                    }
                  })}>{companies.map((company) => (<option key={company.id} value={company.id}>
                    {company.company_name}</option>))}
                  </select>)
                  : (user.company_name || "-")):(user.company_name)}</td>


                <td>
                  {updatingUserId === user.id
                    ? (currentUser?.role === "superadmin"
                      ? (<select value={editedUsers[user.id]?.role || ""} onChange={(e) => setEditedUsers({
                        ...editedUsers,
                        [user.id]: {
                          ...editedUsers[user.id],
                          role: e.target.value
                        }
                      })}>
                        <option value="user">User</option>
                        <option value="admin">Admin </option>
                      </select>
                      )
                      : (<span className={`role_badge ${user.role}`}>{user.role}</span>)
                    )
                    : (<span className={`role_badge ${user.role}`}>{user.role}</span>)}</td>

                <td>{updatingUserId === user.id
                  ? (<select value={editedUsers[user.id]?.privilege_type || ""} onChange={(e) => setEditedUsers({
                    ...editedUsers,
                    [user.id]: {
                      ...editedUsers[user.id],
                      privilege_type: e.target.value
                    }
                  })}>
                    <option value="permanent">Permanent</option>
                    <option value="temporary">Temporary </option>
                  </select>
                  )
                  : (user.privilege_type)}</td>

                <td> {updatingUserId === user.id
                  ? (editedUsers[user.id]?.privilege_type === "temporary" ? (
                    <input type="datetime-local" value={editedUsers[user.id]?.expires_at || ""} onChange={(e) => setEditedUsers({
                      ...editedUsers,
                      [user.id]: {
                        ...editedUsers[user.id],
                        expires_at: e.target.value
                      }
                    })
                    }
                    />
                  ) : ("-")
                  )
                  : (user.expires_at || "-")}</td>


                {/*status column*/}
                <td>
                  <span className={`status_badge ${pendingStatus[user.id] || user.status}`}>{(pendingStatus[user.id] || user.status || "").toUpperCase()}</span>
                </td>
                <td>
                  <button onClick={() => {
                    setDeleteUserId(null);
                    setEditingUserId(editingUserId === user.id ? null : user.id)
                  }}>
                    ✏️ Edit
                  </button>
                </td>
              </tr>
              {editingUserId === user.id && (
                <tr className="action_row">

                  <td colSpan="8">

                    <button
                      onClick={() => {

                        const selectedCompany = companies.find(company => company.company_name === user.company_name);

                        setUpdatingUserId(user.id);

                        setEditedUsers({
                          ...editedUsers,
                          [user.id]: {
                            username: user.username, email: user.email, company_id: selectedCompany?.id || "", role: user.role,
                            privilege_type: user.privilege_type, expires_at: user.expires_at || "",
                          }
                        });
                      }}>
                      ↳  ✏️ Update
                    </button>

                    <button onClick={() => setPendingStatus({
                      ...pendingStatus,
                      [user.id]:
                        (pendingStatus[user.id] || user.status) === "active" ? "inactive" : "active"
                    })} >
                      {(pendingStatus[user.id] || user.status) === "active" ? "🔴 Deactivate" : "🟢 Activate"}
                    </button>

                    <button onClick={async () => {

                      if (editedUsers[user.id]) {
                        // User Info Update
                        await updateUser(user.id, editedUsers[user.id]);
                      }
                      //Status update
                      if (pendingStatus[user.id] && pendingStatus[user.id] !== user.status) {
                        await updateUserStatus(user.id, pendingStatus[user.id]);
                      }
                      const data = await getUsers();
                      setUsers(data);
                      setEditingUserId(null);
                      setUpdatingUserId(null)
                      setPendingStatus({});
                      setEditedUsers({});
                    }}>
                      💾 Save
                    </button>

                    <button onClick={() => { setPendingStatus({}); setEditingUserId(null); setUpdatingUserId(null); setEditedUsers({}); }} >
                      ❌ Cancel
                    </button>

                    <button onClick={() => setDeleteUserId(user.id)} >
                      🗑️ Delete
                    </button>
                  </td>

                </tr>

              )}
              {deleteUserId === user.id && (
                <tr className="delete_confirm_row">

                  <td colSpan="8">
                    ⚠️ Are you sure you want to permanently delete this user?

                    <button onClick={async () => {
                      await deleteUser(user.id);
                      const data = await getUsers();
                      setUsers(data);
                      setDeleteUserId(null);
                      setEditingUserId(null);
                    }}>Yes Delete </button>

                    <button onClick={() => setDeleteUserId(null)}> Cancel </button>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}


        </tbody>


      </table>
      {
        showCreatePanel && (
          <div className="create_user_panel">

            <div className="panel_header">
              <h2>Create User</h2>

              <button onClick={() => setShowCreatePanel(false)} > ✕ </button>
            </div>

            <hr />

            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            {errors.username && (<p className="error_message"> {errors.username} </p>)}

            <label>Email</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && (<p className="error_message"> {errors.email} </p>)}

            <label>Phone Number</label>
            <input type="text" placeholder="0123456789 / nullable" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            {errors.phoneNumber && (<p className="error_message"> {errors.phoneNumber} </p>)}

            <label>Password</label>
            <div className="password_panel">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" className="password_display" onClick={() => setShowPassword(!showPassword)}>  {showPassword ? <MdVisibilityOff /> : <MdVisibility />} </button>
            </div>
            {errors.password && (<p className="error_message"> {errors.password} </p>)}

            <label>Company</label>
            <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
              <option value="">  Select Company</option>
              {companies.map((company) => (<option key={company.id} value={company.id}  >     {company.company_name}  </option>))}
            </select>
            {errors.company && (<p className="error_message"> {errors.company} </p>)}

            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <label>Privelege Type</label>
            <select value={privilegeType} onChange={(e) => setPrivilegeType(e.target.value)}>
              <option value="permanent">Permanent</option>
              <option value="temporary">Temporary</option>
            </select>


            {
              privilegeType === "temporary" && (
                <>
                  <label> Expiry Date </label>
                  <input className="datetime_icon" type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
                  {errors.expiresAt && (<p className="error_message"> {errors.expiresAt} </p>)}
                </>
              )
            }

            <button className="create_submit_btn" onClick={async () => {
              // ====================
              // Validation
              // ====================
              const validationErrors = {};

              // Username
              if (!username.trim()) { validationErrors.username = "Username is required"; }

              // Email
              if (!email.trim()) { validationErrors.email = "Email is required"; }
              else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
              ) { validationErrors.email = "Invalid email format"; }

              // Password
              if (!password.trim()) { validationErrors.password = "Password is required"; }
              if (phoneNumber && !/^\d{10,11}$/.test(phoneNumber)
              ) {
                validationErrors.phoneNumber = "Phone number must be 10-11 digits";
              }

              //company 
              if (!selectedCompany) { validationErrors.company = "Please select a company"; }

              //privilege types expiredate 
              if (privilegeType === "temporary" && !expiresAt
              ) {
                validationErrors.expiresAt = "Expiry date is required";
              }
              //expired date future date validation
              if (privilegeType === "temporary" && expiresAt && new Date(expiresAt) <= new Date()
              ) {
                validationErrors.expiresAt = "Expiry date must be in the future";
              }

              // 最后统一检查
              if (Object.keys(validationErrors).length > 0
              ) {
                setErrors(validationErrors);
                return;
              }
              setErrors({});

              /////////////////////
              /////payload//////////
              //////////////////////
              const payload = {
                username,
                email,
                password,
                phone_number: phoneNumber || null,
                company_id: selectedCompany ? Number(selectedCompany) : null,
                role,
                privilege_type: privilegeType,
                expires_at: expiresAt || null,
              };
              const result = await createUser(payload);
              console.log("selectedCompany:", selectedCompany);
              console.log("payload:", payload);
              console.log(result);
              setMessage(result.message);
              if (
                result.message.includes("created successfully")
              ) {

                const data = await getUsers();

                setUsers(data);

                setUsername("");
                setEmail("");
                setPassword("");
                setPhoneNumber("");

                setSelectedCompany("");

                setRole("user");

                setPrivilegeType("permanent");

                setExpiresAt("");
              }
            }} >
              Create User
            </button>
            {
              message && (
                <div className="create_message">
                  {message}
                </div>
              )
            }
          </div >
        )
      }
    </div >);
}

export default UserManagement;