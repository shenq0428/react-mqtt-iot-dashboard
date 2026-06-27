const pool = require("../../config/db");

const auditActions = require("../data/auditActions");

async function seedAuditLogs() {

    console.log("\n🌱 Seeding Audit Logs...");

    //--------------------------------------------------
    // Get all users
    //--------------------------------------------------

    const usersResult = await pool.query(`
        SELECT
            id,
            username,
            role,
            company_id
        FROM users
        ORDER BY id
    `);

    let total = 0;

    for (const user of usersResult.rows) {

        // 每个 User 建立 3~5 笔 Audit Log
        const totalLogs = Math.floor(Math.random() * 3) + 3;

        for (let i = 0; i < totalLogs; i++) {

            const audit =
                auditActions[
                    Math.floor(Math.random() * auditActions.length)
                ];

            const targetTypes = [
                "user",
                "company",
                "leave_request"
            ];

            const targetType =
                targetTypes[
                    Math.floor(Math.random() * targetTypes.length)
                ];

            const targetId =
                Math.floor(Math.random() * 30) + 1;

            await pool.query(
                `
                INSERT INTO audit_logs
                (
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
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
                )
                `,
                [
                    user.id,
                    user.username,
                    user.role,
                    user.company_id,
                    audit.action,
                    targetType,
                    targetId,
                    audit.description,
                    "127.0.0.1",
                    "NovaLobster Seeder",
                    "Malaysia"
                ]
            );

            total++;

        }

    }

    console.log(`✅ ${total} Audit Logs inserted`);
    console.log("\n🎉 Audit Logs Completed!\n");

}

module.exports = seedAuditLogs;