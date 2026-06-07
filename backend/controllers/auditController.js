const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
    try {

        const result = await pool.query(`
      SELECT *
      FROM audit_logs
      ORDER BY created_at DESC
    `);

        res.json(result.rows);

    } catch (error) {

        console.error(error);

        res.status(500).json({ message: "Failed to fetch audit logs" });
    }
};

module.exports = { getAuditLogs };