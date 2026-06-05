const pool = require("../config/db");

const createAuditLog = async ({
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
    location,
}) => {

    try {

        await pool.query(
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
            VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
            )
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
                location,
            ]
        );

    } catch (err) {

        console.error(
            "Audit Log Error:",
            err
        );

    }
};

module.exports = {
    createAuditLog
};