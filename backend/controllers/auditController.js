const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const action = req.query.action || "";

        // Count Query
        let countQuery = `
            SELECT COUNT(*)::int AS total
            FROM audit_logs a
        `;

        let countValues = [];

        if (action) {

            countQuery += `
                WHERE a.action = $1
            `;

            countValues.push(action);

        }

        const countResult =
            await pool.query(
                countQuery,
                countValues
            );

        // Main Query
        let mainQuery = `
            SELECT
                a.id,
                u.email,
                a.actor_role,
                c.company_name,
                a.action,
                a.target_type,
                a.target_id,
                a.description,
                a.ip_address,
                a.user_agent,
                a.created_at

            FROM audit_logs a

            LEFT JOIN users u
            ON a.actor_user_id = u.id

            LEFT JOIN companies c
            ON a.company_id = c.id
        `;

        let mainValues = [];

        if (action) {

            mainQuery += `
                WHERE a.action = $1
            `;

            mainValues.push(action);

        }

        mainQuery += `
            ORDER BY a.created_at DESC
            LIMIT $${mainValues.length + 1}
            OFFSET $${mainValues.length + 2}
        `;

        mainValues.push(limit);
        mainValues.push(offset);

        const result =
            await pool.query(
                mainQuery,
                mainValues
            );

        const total =
            countResult.rows[0].total;

        res.json({
            logs: result.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch audit logs"
        });

    }
};

module.exports = {
    getAuditLogs
};