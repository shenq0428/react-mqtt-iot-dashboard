const leaveRequestService = require(
    "../services/leaveRequestService"
);

const handleError = (res, error) => {
    const statusCode = error.statusCode || 500;

    if (statusCode === 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        message:
            statusCode === 500
                ? "Server error"
                : error.message
    });
};

const createLeaveRequest = async (req, res) => {
    try {
        const leaveRequest =
            await leaveRequestService.createLeaveRequest({
                leaveData: req.body,
                actor: req.user
            });

        return res.status(201).json({
            message: "Leave request submitted successfully",
            leaveRequest
        });
    } catch (error) {
        return handleError(res, error);
    }
};

const getMyLeaveRequests = async (req, res) => {
    try {
        const leaveRequests =
            await leaveRequestService.getMyLeaveRequests(
                req.user
            );

        return res.status(200).json(leaveRequests);
    } catch (error) {
        return handleError(res, error);
    }
};

const getAllLeaveRequest = async (req, res) => {
    try {
        const leaveRequests =
            await leaveRequestService.getAllLeaveRequest(
                req.user
            );

        return res.status(200).json(leaveRequests);
    } catch (error) {
        return handleError(res, error);
    }
};

const getLeaveRequestById = async (req, res) => {
    try {
        const leaveRequest =
            await leaveRequestService.getLeaveRequestById({
                leaveRequestId: req.params.id,
                actor: req.user
            });

        return res.status(200).json(leaveRequest);
    } catch (error) {
        return handleError(res, error);
    }
};

const updateLeaveRequestStatus = async (req, res) => {
    try {
        const leaveRequest =
            await leaveRequestService.updateLeaveRequestStatus({
                leaveRequestId: req.params.id,
                status: req.body.status,
                rejectedReason: req.body.rejected_reason,
                actor: req.user
            });

        // 保持你旧 API 的 response：array
        return res.status(200).json([leaveRequest]);
    } catch (error) {
        return handleError(res, error);
    }
};

const updateLeaveRequest = async (req, res) => {
    try {
        const leaveRequest =
            await leaveRequestService.updateLeaveRequest({
                leaveRequestId: req.params.id,
                leaveData: req.body,
                actor: req.user
            });

        return res.status(200).json({
            message: "Leave request updated successfully",
            leaveRequest
        });
    } catch (error) {
        return handleError(res, error);
    }
};

const cancelLeaveRequest = async (req, res) => {
    try {
        const leaveRequest =
            await leaveRequestService.cancelLeaveRequest({
                leaveRequestId: req.params.id,
                actor: req.user
            });

        return res.status(200).json({
            message: "Leave request cancelled successfully",
            leaveRequest
        });
    } catch (error) {
        return handleError(res, error);
    }
};

module.exports = {
    createLeaveRequest,
    getMyLeaveRequests,
    getAllLeaveRequest,
    updateLeaveRequestStatus,
    getLeaveRequestById,
    updateLeaveRequest,
    cancelLeaveRequest
};