const pool = require("../config/db");

const getDashboardStatus = async (req, res) => {
    try {
        const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
        const totalCompanies = await pool.query("SELECT COUNT(*) FROM companies");
        const todayLogins = await pool.query(`SELECT COUNT(*) FROM audit_logs WHERE action = 'LOGIN_SUCCESS' AND DATE(created_at) = CURRENT_DATE`);

        const lastLogin = await pool.query(`SELECT u.email, a.created_at FROM audit_logs a JOIN users u ON a.actor_user_id = u.id WHERE a.action = 'LOGIN_SUCCESS' ORDER BY a.created_at DESC LIMIT 1`);

        res.json({
            totalUsers: Number(totalUsers.rows[0].count),
            totalCompanies: Number(totalCompanies.rows[0].count),
            todayLogins: Number(todayLogins.rows[0].count),

            lastLoginUser: lastLogin.rows[0]?.email || "No Login",

            lastLoginTime: lastLogin.rows[0]?.created_at || null,
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({ message: "FAILED TO LOAD DASHBOARD PANEL STATUS", });
    }
};

module.exports = { getDashboardStatus };