const pool = require("../config/db");

const createLeaveRequest = async (req, res) => {

    try {

        const {
            leave_type,
            start_date,
            end_date,
            reason
        } = req.body;

        const requestNumber = `TEMP-${Date.now()}`;

        const result = await pool.query(
            `
            INSERT INTO leave_requests (
                request_number,
                user_id,
                company_id,
                leave_type,
                start_date,
                end_date,
                reason
            )
            VALUES ($1,$2,$3,$4,$5,$6,$7)

            RETURNING *
            `,
            [
                requestNumber,
                req.user.id,
                req.user.company_id,
                leave_type,
                start_date,
                end_date,
                reason
            ]
        );

        res.status(201).json({
            message: "Leave request submitted successfully",
            leaveRequest: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Server error" });

    }
};

const getMyLeaveRequests = async (req, res) => {

    try {

        const result = await pool.query(
            `
            SELECT *
            FROM leave_requests
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [req.user.id]
        );

        res.status(200).json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Server error" });

    }

};

const getAllLeaveRequest = async (req, res) => {
    try {

        const result = await pool.query(
            `
            SELECT
                lr.*,
                u.username,
                u.email
            FROM 
                leave_requests lr
            INNER JOIN 
                users u
            ON 
                lr.user_id = u.id
            WHERE 
                lr.company_id = $1
            ORDER BY 
                lr.created_at DESC
            `,
            [req.user.company_id]
        );

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const updateLeaveRequestStatus = async (req, res) => {
    try {
        //params from url, user from jwt decode, body from frontend input
        const id = req.params.id;
        const reviewedBy = req.user.id;
        const actorCompanyId = req.user.company_id;

        const { status, rejected_reason } = req.body;

        const rejectionReason =
            status === "rejected"
                ? rejected_reason?.trim()
                : null;

        if (status === "rejected" && !rejectionReason) {
            return res.status(400).json({
                message: "A rejection reason is required."
            });
        }

        const result = await pool.query(`
                                        UPDATE 
                                            leave_requests
                                        SET 
                                            status = $1,
                                            reviewed_by = $2,
                                            reviewed_at = CURRENT_TIMESTAMP,
                                            rejected_reason = $5,
                                            updated_at = CURRENT_TIMESTAMP
                                        WHERE 
                                            id = $3
                                        AND 
                                            company_id = $4
                                        AND
                                            status = 'pending'
                                        RETURNING *
                                        `,
            //如果被修改的人的company id和修改者的company id不一样就失败避免其他人修改
            [status, reviewedBy, id, actorCompanyId, rejectionReason]);

        if (result.rows.length === 0) { return res.status(400).json({ message: "Only pending leave requests can be updated." }); }

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

const getLeaveRequestById = async (req, res) => {

    try {
        const leaveRequestId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const companyId = req.user.company_id;

        const canViewCompanyLeaveRequests = ["admin", "company_super_admin"].includes(userRole);

        const result = canViewCompanyLeaveRequests
            ? await pool.query(
                `
                SELECT
                    lr.*,
                    u.username,
                    u.email,
                    u.role AS requester_role
                FROM leave_requests lr
                INNER JOIN users u
                    ON lr.user_id = u.id
                WHERE
                    lr.id = $1
                AND
                    lr.company_id = $2
                `,
                [leaveRequestId, companyId]
            )
            : await pool.query(
                `
                SELECT *
                FROM leave_requests
                WHERE
                    id = $1
                AND
                    user_id = $2
                `,
                [leaveRequestId, userId]
            );

        if (result.rowCount === 0) { return res.status(404).json({ message: "Leave request not found" }); }

        res.status(200).json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }

};

const updateLeaveRequest = async (req, res) => {
    try {
        const id = req.params.id;
        const { leave_type, start_date, end_date, reason } = req.body;

        const result = await pool.query(`
        UPDATE 
            leave_requests
        SET 
            leave_type=$1,
            start_date=$2,
            end_date=$3,
            reason=$4,
            updated_at = CURRENT_TIMESTAMP
        WHERE
            id=$5
        AND 
            user_id=$6
        AND
            status='pending'
        RETURNING *
         `, [leave_type, start_date, end_date, reason, id, req.user.id])

        if (result.rows.length === 0) { return res.status(400).json({ message: "Only pending leave requests can be updated." }); }

        res.status(200).json({
            message: "Leave request updated successfully",
            leaveRequest: result.rows[0]
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const cancelLeaveRequest = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await pool.query(
            `
            UPDATE leave_requests
            SET
                status = 'cancelled',
                cancelled_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE
                id = $1
            AND
                user_id = $2
            AND
                status = 'pending'
            RETURNING *
            `,
            [id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({
                message: "Only pending leave requests can be cancelled."
            });
        }

        res.status(200).json({
            message: "Leave request cancelled successfully",
            leaveRequest: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { createLeaveRequest, getMyLeaveRequests, getAllLeaveRequest, updateLeaveRequestStatus, getLeaveRequestById, updateLeaveRequest, cancelLeaveRequest }