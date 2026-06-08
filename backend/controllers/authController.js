//调用registerUser函数和loginUser函数给routes/authRoutes.js使用
//authController=身份认证(Authentication)

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAuditLog } = require("../utils/auditLogger");
//register user function
const registerUser = async (req, res) => {
    try {
        const { email, password, role, phone_number } = req.body;

        // check existing email
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user
        const newUser = await pool.query(
            `INSERT INTO users 
      (email, password, role, phone_number)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, role`,
            [email, hashedPassword, role || "user", phone_number]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: newUser.rows[0],
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error",
        });
    }
};

//login user function
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user exists
        const userResult = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userResult.rows.length === 0) {
            console.log("EMAIL NOT FOUND");
            //wrong email written in audit log
            await createAuditLog({
                actor_user_id: null,
                actor_username: null,
                actor_role: null,
                company_id: null,
                action: "LOGIN_FAILED",
                target_type: "user",
                target_id: null,
                description: `Login failed for email ${email}`,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                location: null
            });
            return res.status(401).json({ message: "Invalid email or password", });

        }

        const user = userResult.rows[0];

        //检查teomporary account时间是否超时
        if (
            user.privilege_type === "temporary" && user.expires_at && new Date(user.expires_at) < new Date()
        ) {
            await createAuditLog({
                actor_user_id: user.id,
                actor_username: user.username,
                actor_role: user.role,
                company_id: user.company_id,
                action: "LOGIN_FAILED",
                target_type: "user",
                target_id: user.id,
                description: `Login failed for user ${user.username}: account expired`,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                location: null
            });
            return res.status(403).json({
                message: "Account expired"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            await createAuditLog({
                actor_user_id: user.id,
                actor_username: user.username,
                actor_role: user.role,
                company_id: user.company_id,
                action: "LOGIN_FAILED",
                target_type: "user",
                target_id: user.id,
                description: `Login failed for user ${user.username}: wrong password`,
                ip_address: req.ip,
                user_agent: req.headers["user-agent"],
                location: null
            });
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }



        // generate jwt token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role,
                company_id: user.company_id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "12h",
            }
        );

        //insert audit log
        await createAuditLog({
            actor_user_id: user.id,
            actor_username: user.username,
            actor_role: user.role,
            company_id: user.company_id,
            action: "LOGIN_SUCCESS",
            target_type: "user",
            target_id: user.id,
            description: `User ${user.username} logged in successfully`,
            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            location: null

        });

        res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error",
        });
    }
};

//get me function to return current user info based on token
const getCurrentUser = async (req, res) => {
    try {
        const users = await pool.query(
            `SELECT u.id,u.username,u.email,u.role,c.company_name 
            FROM users u 
            LEFT JOIN companies c 
            ON u.company_id = c.id
            WHERE u.id = $1`,
            [req.user.id]

        );
        res.status(200).json({
            message: "User Info",
            user: users.rows[0],
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error",
        });

    }
};

const logoutUser = async (req, res) => {

    try {

        await createAuditLog({

            actor_user_id: req.user.id,

            actor_username: req.user.username,

            actor_role: req.user.role,

            company_id: req.user.company_id,

            action: "LOGOUT",

            target_type: "user",

            target_id: req.user.id,

            description:
                `User ${req.user.username} logged out`,

            ip_address: req.ip,

            user_agent:
                req.headers["user-agent"],

            location: null

        });

        res.status(200).json({
            message: "Logout successful"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }
};
module.exports = { registerUser, loginUser, getCurrentUser, logoutUser};