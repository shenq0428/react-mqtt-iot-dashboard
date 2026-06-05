//userController=用户管理(User Management) 管理我的数据库里的users表，提供给前端调用的接口
// users table crud :create read update delete
const pool = require("../config/db");
const bcrypt = require("bcrypt");

//create User function 
const createUser = async (req, res) => {
    try {
        // ====================
        // Request Body
        // ====================
        let {
            username,
            email,
            password,
            role,
            privilege_type,
            expires_at,
            phone_number,
            company_id,
        } = req.body;

        // ====================
        // Validation
        // ====================
        if (!username || !email || !password || !role || !privilege_type
        ) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        //role validation
        const validRoles = ["user", "admin", "superadmin"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        //privilegetype validation,must be permanent or temporary
        const validPrivilegeTypes = ["permanent", "temporary",];
        if (!validPrivilegeTypes.includes(privilege_type)
        ) {
            return res.status(400).json({ message: "Invalid privilege type", });
        }

        //拿来限制只有admin只能够创造user但是不能够创造admin对吧，但是假设有人输入"role":"charizard" 还是能够进去
        if (req.user.role === "admin" && role !== "user") {
            return res.status(403).json({
                message: "Admin can only create users"
            });
        }

        //限制superadmin不能创造superadmin
        if (role === "superadmin"
        ) {
            return res.status(403).json({ message: "Cannot create superadmin account" });
        }

        //temporary account检查,避免temporary account expire at null; temporary account 一定要设置好expiredate
        if (
            privilege_type === "temporary" && !expires_at
        ) {
            return res.status(400).json({
                message: "Temporary account requires expiry date"
            });
        }

        // ====================
        // Data Normalization
        // ====================
if (privilege_type === "permanent") {
            expires_at = null;
        }

        // ====================
        // Existing User Check
        // ====================
        // Check existing email
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

         // ====================
        // Password Hashing
        // ====================
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ====================
        // Create User
        // ====================
        // Insert user
        const newUser = await pool.query(
            `  INSERT INTO users (username, email, password, role, privilege_type, expires_at,  phone_number,company_id)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *  `,
            [
                username,
                email,
                hashedPassword,
                role,
                privilege_type,
                expires_at,
                phone_number,
                company_id,
            ]
        );
        
        // ====================
        // Response
        // ====================
        res.status(201).json({
            message: `User ${newUser.rows[0].username} created successfully`,
            user: newUser.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", });
    }
};
//get all users function
const getUsers = async (req, res) => {
    try {
        let users;
        if (req.user.role === "superadmin") {
            users = await pool.query(
                `
                SELECT
                    u.id,
                    u.username,
                    u.email,
                    u.role,
                    u.privilege_type,
                    u.expires_at,
                    u.status,
                    c.company_name
                FROM users u
                LEFT JOIN companies c
                ON u.company_id = c.id
                `
            );
        } else {
            users = await pool.query(
                `
                SELECT
                    u.id,
                    u.username,
                    u.email,
                    u.role,
                    u.privilege_type,
                    u.expires_at,
                    u.status,
                    c.company_name
                FROM users u
                LEFT JOIN companies c
                ON u.company_id = c.id
                WHERE u.company_id = $1
                `,
                [req.user.company_id]
            );
        }
        res.status(200).json(users.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Server error",
        });
    }
};

//save button in user management page will call this updateUserStatus function to update the user status in the database, and then the frontend will re-fetch the user list to get the updated status
const updateUserStatus = async (req, res) => {
    //params 等同于PATCH /api/users/:id/status 这里的：id 会被8替代，body里是{status:"active"}或者{status:"inactive"}
    //结果有可能会是 PATCH /api/users/8/status  body:{status:"active"} 代表把id为8的用户的状态改成active，或者是{status:"inactive"} 代表把id为8的用户的状态改成inactive
    const { id } = req.params;
    const { status } = req.body;

    try {
        if (status !== "active" && status !== "inactive"
        ) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const results = await pool.query(
            "UPDATE users SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        res.status(200).json(results.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", });
    }
};

//later set disable superadmin account been delete
const deleteUser = async (req, res) => {

    const { id } = req.params;

    //avoid delete own account
    if (Number(req.user.id) === Number(id)) {
        return res.status(400).json({
            message: "Cannot delete your own account"
        });
    }
    try {
        const result = await pool.query(
            ` DELETE FROM users  WHERE id = $1  RETURNING *  `,
            [id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "server error"
        })
    }
};

//module.exports = {createUser, getUsers, updateUserStatus, updateUser, deleteUser};
module.exports = { getUsers, updateUserStatus, deleteUser, createUser }; 