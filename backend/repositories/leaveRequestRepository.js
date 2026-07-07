const pool = require("../config/db");

const createLeaveRequest = async (
    {
        requestNumber,
        userId,
        companyId,
        leaveType,
        startDate,
        endDate,
        reason
    },
    db = pool
) => {
    const result = await db.query(
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
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            requestNumber,
            userId,
            companyId,
            leaveType,
            startDate,
            endDate,
            reason
        ]
    );

    return result.rows[0];
};

const findLeaveRequestsByUserId = async (userId, db = pool) => {
    const result = await db.query(
        `
        SELECT *
        FROM leave_requests
        WHERE user_id = $1
        ORDER BY created_at DESC
        `,
        [userId]
    );

    return result.rows;
};

const findLeaveRequestsByCompanyId = async (
    companyId,
    db = pool
) => {
    const result = await db.query(
        `
        SELECT
            lr.*,
            u.username,
            u.email
        FROM leave_requests lr
        INNER JOIN users u
            ON lr.user_id = u.id
        WHERE lr.company_id = $1
        ORDER BY lr.created_at DESC
        `,
        [companyId]
    );

    return result.rows;
};

const findLeaveRequestByIdAndUserId = async (
    leaveRequestId,
    userId,
    db = pool
) => {
    const result = await db.query(
        `
        SELECT *
        FROM leave_requests
        WHERE id = $1
        AND user_id = $2
        `,
        [leaveRequestId, userId]
    );

    return result.rows[0] || null;
};

const findLeaveRequestByIdAndCompanyId = async (
    leaveRequestId,
    companyId,
    db = pool
) => {
    const result = await db.query(
        `
        SELECT
            lr.*,
            u.username,
            u.email,
            u.role AS requester_role
        FROM leave_requests lr
        INNER JOIN users u
            ON lr.user_id = u.id
        WHERE lr.id = $1
        AND lr.company_id = $2
        `,
        [leaveRequestId, companyId]
    );

    return result.rows[0] || null;
};

const updatePendingLeaveRequestStatus = async (
    {
        leaveRequestId,
        status,
        reviewedBy,
        companyId,
        rejectionReason
    },
    db = pool
) => {
    const result = await db.query(
        `
        UPDATE leave_requests
        SET
            status = $1,
            reviewed_by = $2,
            reviewed_at = CURRENT_TIMESTAMP,
            rejected_reason = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        AND company_id = $5
        AND status = 'pending'
        RETURNING *
        `,
        [
            status,
            reviewedBy,
            rejectionReason,
            leaveRequestId,
            companyId
        ]
    );

    return result.rows[0] || null;
};

const updatePendingLeaveRequestByUserId = async (
    {
        leaveRequestId,
        userId,
        leaveType,
        startDate,
        endDate,
        reason
    },
    db = pool
) => {
    const result = await db.query(
        `
        UPDATE leave_requests
        SET
            leave_type = $1,
            start_date = $2,
            end_date = $3,
            reason = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        AND user_id = $6
        AND status = 'pending'
        RETURNING *
        `,
        [
            leaveType,
            startDate,
            endDate,
            reason,
            leaveRequestId,
            userId
        ]
    );

    return result.rows[0] || null;
};

const cancelPendingLeaveRequestByUserId = async (
    leaveRequestId,
    userId,
    db = pool
) => {
    const result = await db.query(
        `
        UPDATE leave_requests
        SET
            status = 'cancelled',
            cancelled_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        AND user_id = $2
        AND status = 'pending'
        RETURNING *
        `,
        [leaveRequestId, userId]
    );

    return result.rows[0] || null;
};

module.exports = {
    createLeaveRequest,
    findLeaveRequestsByUserId,
    findLeaveRequestsByCompanyId,
    findLeaveRequestByIdAndUserId,
    findLeaveRequestByIdAndCompanyId,
    updatePendingLeaveRequestStatus,
    updatePendingLeaveRequestByUserId,
    cancelPendingLeaveRequestByUserId
};