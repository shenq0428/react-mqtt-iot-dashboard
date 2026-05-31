//调用registerUser函数和loginUser函数给routes/authRoutes.js使用

const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = userResult.rows[0];

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // generate jwt token
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                company_id: user.company_id,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h",
            }
        );

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
                    email,
                    u.role,
                    c.company_name
                FROM users
                LEFT JOIN companies c
                ON users.company_id = c.id
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
module.exports = { registerUser, loginUser, getCurrentUser, getUsers };