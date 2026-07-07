const pool = require("../config/db");

const buildFilters = ({ action, email }) => {
    const conditions = [];
    const values = [];

    if (action) {
        values.push(action);
        conditions.push(`a.action = $${values.length}`);
    }

    if (email) {
        values.push(`%${email}%`);
        conditions.push(`u.email ILIKE $${values.length}`);
    }

    return {
        whereClause:
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "",

        values
    };
};

const countAuditLogs = async ({ action, email }, db = pool) => {
    const { whereClause, values } = buildFilters({
        action,
        email
    });

    const result = await db.query(
        `
        SELECT COUNT(*)::int AS total
        FROM audit_logs a
        LEFT JOIN users u
            ON a.actor_user_id = u.id
        ${whereClause}
        `,
        values
    );

    return result.rows[0].total;
};

const findAuditLogs = async (
    { action, email, limit, offset },
    db = pool
) => {
    const { whereClause, values } = buildFilters({
        action,
        email
    });

    values.push(limit, offset);

    const result = await db.query(
        `
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

        ${whereClause}

        ORDER BY a.created_at DESC

        LIMIT $${values.length - 1}
        OFFSET $${values.length}
        `,
        values
    );

    return result.rows;
};

const createAuditLog = async (auditData, db = pool) => {
    const {
        actor_user_id,
        actor_username,
        actor_role,
        company_id,
        action,
        target_type,
        target_id,
        description,
        ip_address,
        user_agent,
        location
    } = auditData;

    const result = await db.query(
        `
        INSERT INTO audit_logs (
            actor_user_id,
            actor_username,
            actor_role,
            company_id,
            action,
            target_type,
            target_id,
            description,
            ip_address,
            user_agent,
            location
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
        `,
        [
            actor_user_id,
            actor_username,
            actor_role,
            company_id,
            action,
            target_type,
            target_id,
            description,
            ip_address,
            user_agent,
            location
        ]
    );

    return result.rows[0];
};

module.exports = { countAuditLogs, findAuditLogs, createAuditLog };