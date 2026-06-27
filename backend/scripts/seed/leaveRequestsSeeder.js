const pool = require("../../config/db");

const leaveReasons = require("../data/leaveReasons");

async function seedLeaveRequests() {

    console.log("\n🌱 Seeding Leave Requests...");

    //----------------------------------------------------
    // Get all normal users
    //----------------------------------------------------

    const usersResult = await pool.query(`
        SELECT
            id,
            company_id,
            username
        FROM users
        WHERE role='user'
        ORDER BY id
    `);

    const adminResult = await pool.query(`
        SELECT
            id,
            company_id
        FROM users
        WHERE role IN ('admin','company_super_admin')
        ORDER BY id
    `);

    let requestNo = 1;

    for (const user of usersResult.rows) {

        //----------------------------------------
        // Random Leave Type
        //----------------------------------------

        const leave =
            leaveReasons[
                Math.floor(Math.random() * leaveReasons.length)
            ];

        //----------------------------------------
        // Random Status
        //----------------------------------------

        const statuses = [
            "pending",
            "approved",
            "rejected",
            "cancelled"
        ];

        const status =
            statuses[
                Math.floor(Math.random() * statuses.length)
            ];

        //----------------------------------------
        // Date
        //----------------------------------------

        const start = new Date();

        start.setDate(
            start.getDate() +
            Math.floor(Math.random() * 60)
        );

        const end = new Date(start);

        end.setDate(
            start.getDate() +
            Math.floor(Math.random() * 4 + 1)
        );

        //----------------------------------------
        // Request Number
        //----------------------------------------

        const requestNumber =
            `${user.username.toUpperCase()}_${String(requestNo).padStart(4, "0")}`;

        requestNo++;

        //----------------------------------------
        // Find Admin
        //----------------------------------------

        const admin =
            adminResult.rows.find(
                a => a.company_id === user.company_id
            );

        //----------------------------------------
        // Approved Data
        //----------------------------------------

        let approvedBy = null;
        let approvedAt = null;
        let rejectedReason = null;
        let cancelledAt = null;

        if (status === "approved") {

            approvedBy = admin?.id ?? null;
            approvedAt = new Date();

        }

        if (status === "rejected") {

            approvedBy = admin?.id ?? null;
            approvedAt = new Date();

            rejectedReason =
                "Insufficient leave balance.";

        }

        if (status === "cancelled") {

            cancelledAt = new Date();

        }

        //----------------------------------------
        // Duplicate Check
        //----------------------------------------

        const exists = await pool.query(
            `
            SELECT id
            FROM leave_requests
            WHERE request_number=$1
            `,
            [
                requestNumber
            ]
        );

        if (exists.rows.length > 0) {

            console.log(`⏩ ${requestNumber}`);

            continue;

        }

        //----------------------------------------
        // Insert
        //----------------------------------------

        await pool.query(
            `
            INSERT INTO leave_requests
            (
                request_number,
                user_id,
                company_id,
                leave_type,
                start_date,
                end_date,
                reason,
                attachment_url,
                status,
                approved_by,
                approved_at,
                rejected_reason,
                cancelled_at
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
            )
            `,
            [
                requestNumber,
                user.id,
                user.company_id,
                leave.leave_type,
                start,
                end,
                leave.reason,
                null,
                status,
                approvedBy,
                approvedAt,
                rejectedReason,
                cancelledAt
            ]
        );

        console.log(`✅ ${requestNumber}`);

    }

    console.log("\n🎉 Leave Requests Completed!\n");

}

module.exports = seedLeaveRequests;