const pool = require("../config/db");

const getAuditLogs = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const action = req.query.action || "";
        const email = req.query.email || "";

        let conditions = [];

        // Count Query
        let countQuery = `
        SELECT COUNT(*)::int AS total

        FROM audit_logs a

        LEFT JOIN users u
        ON a.actor_user_id = u.id
        `;

        let countValues = [];

        if (action) {
            conditions.push(`a.action = $${countValues.length + 1}`);
            countValues.push(action);
        }

        if (email) {
            conditions.push(`u.email ILIKE $${countValues.length + 1}`);
            countValues.push(`%${email}%`);

        }

        if (conditions.length > 0) {
            countQuery += `WHERE ${conditions.join(" AND ")}`;
        }

        //执行 Count Query
        //Query 负责描述要做什么
        //Values 负责提供实际数据
        const countResult = await pool.query(countQuery, countValues);

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

        let mainConditions = [];
        let mainValues = [];

        if (action) {
            mainConditions.push(`a.action = $${mainValues.length + 1}`);
            mainValues.push(action);
        }

        if (email) {
            mainConditions.push(`u.email ILIKE $${mainValues.length + 1}`);
            mainValues.push(`%${email}%`);
        }

        if (mainConditions.length > 0) {
            mainQuery += `WHERE ${mainConditions.join(" AND ")}`;
        }

        /*意思是默认的情况下收到的第一个数据是limit,第二个是offset 
        有action的话limit就是第二个offset是第三个,以外在上面已经把ACTION push进来了*/
        mainQuery += `
            ORDER BY a.created_at DESC
            LIMIT $${mainValues.length + 1}
            OFFSET $${mainValues.length + 2}
        `;

        mainValues.push(limit);
        mainValues.push(offset);


        //console.log(mainQuery);
        //console.log(mainValues);
        //console.log(countQuery);
        //console.log(countValues);

        //Query 负责描述要做什么
        //Values 负责提供实际数据
        const result = await pool.query(mainQuery, mainValues);

        const total = countResult.rows[0].total;

        /* 
        console.log({
            logs: result.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
        */

        res.json({
            logs: result.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Failed to fetch audit logs" });

    }
};

module.exports = { getAuditLogs };