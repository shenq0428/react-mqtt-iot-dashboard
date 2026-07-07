const leaveRequestRepository = require(
    "../repositories/leaveRequestRepository"
);

const createAppError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const createLeaveRequest = async ({ leaveData, actor }) => {
    const {
        leave_type,
        start_date,
        end_date,
        reason
    } = leaveData;

    if (!leave_type || !start_date || !end_date) {
        throw createAppError(
            400,
            "Leave type, start date and end date are required."
        );
    }

    const requestNumber = `TEMP-${Date.now()}`;

    return leaveRequestRepository.createLeaveRequest({
        requestNumber,
        userId: actor.id,
        companyId: actor.company_id,
        leaveType: leave_type,
        startDate: start_date,
        endDate: end_date,
        reason
    });
};

const getMyLeaveRequests = async (actor) => {
    return leaveRequestRepository.findLeaveRequestsByUserId(
        actor.id
    );
};

const getAllLeaveRequest = async (actor) => {
    if (actor.role !== "admin") {
        throw createAppError(
            403,
            "Only admin can view company leave requests."
        );
    }

    return leaveRequestRepository.findLeaveRequestsByCompanyId(
        actor.company_id
    );
};

const getLeaveRequestById = async ({
    leaveRequestId,
    actor
}) => {
    let leaveRequest;

    // 只有 admin 能看同公司其他人的 leave request
    if (actor.role === "admin") {
        leaveRequest =
            await leaveRequestRepository.findLeaveRequestByIdAndCompanyId(
                leaveRequestId,
                actor.company_id
            );
    } else {
        // user 和 superadmin 都只会走自己的 leave request
        leaveRequest =
            await leaveRequestRepository.findLeaveRequestByIdAndUserId(
                leaveRequestId,
                actor.id
            );
    }

    if (!leaveRequest) {
        throw createAppError(404, "Leave request not found");
    }

    return leaveRequest;
};

const updateLeaveRequestStatus = async ({
    leaveRequestId,
    status,
    rejectedReason,
    actor
}) => {
    if (actor.role !== "admin") {
        throw createAppError(
            403,
            "Only admin can review leave requests."
        );
    }

    if (!["approved", "rejected"].includes(status)) {
        throw createAppError(
            400,
            "Status must be approved or rejected."
        );
    }

    const rejectionReason =
        status === "rejected"
            ? rejectedReason?.trim()
            : null;

    if (status === "rejected" && !rejectionReason) {
        throw createAppError(
            400,
            "A rejection reason is required."
        );
    }

    const leaveRequest =
        await leaveRequestRepository.updatePendingLeaveRequestStatus({
            leaveRequestId,
            status,
            reviewedBy: actor.id,
            companyId: actor.company_id,
            rejectionReason
        });

    if (!leaveRequest) {
        throw createAppError(
            400,
            "Only pending leave requests can be updated."
        );
    }

    return leaveRequest;
};

const updateLeaveRequest = async ({
    leaveRequestId,
    leaveData,
    actor
}) => {
    const {
        leave_type,
        start_date,
        end_date,
        reason
    } = leaveData;

    if (!leave_type || !start_date || !end_date) {
        throw createAppError(
            400,
            "Leave type, start date and end date are required."
        );
    }

    const leaveRequest =
        await leaveRequestRepository.updatePendingLeaveRequestByUserId({
            leaveRequestId,
            userId: actor.id,
            leaveType: leave_type,
            startDate: start_date,
            endDate: end_date,
            reason
        });

    if (!leaveRequest) {
        throw createAppError(
            400,
            "Only pending leave requests can be updated."
        );
    }

    return leaveRequest;
};

const cancelLeaveRequest = async ({
    leaveRequestId,
    actor
}) => {
    const leaveRequest =
        await leaveRequestRepository.cancelPendingLeaveRequestByUserId(
            leaveRequestId,
            actor.id
        );

    if (!leaveRequest) {
        throw createAppError(
            400,
            "Only pending leave requests can be cancelled."
        );
    }

    return leaveRequest;
};

module.exports = {
    createLeaveRequest,
    getMyLeaveRequests,
    getAllLeaveRequest,
    getLeaveRequestById,
    updateLeaveRequestStatus,
    updateLeaveRequest,
    cancelLeaveRequest
};