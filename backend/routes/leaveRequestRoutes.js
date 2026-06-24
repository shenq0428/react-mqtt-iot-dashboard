const { verifyToken } = require("../middleware/authMiddleware");
const { createLeaveRequest, getMyLeaveRequests, getAllLeaveRequest, updateLeaveRequestStatus } = require("../controllers/leaveRequestController");
const {requireRole} = require("../middleware/roleMiddleware");

const express = require("express");

const router = express.Router();

//start from /api/leave-requests

//user create leave request
router.post(
    "/",
    verifyToken,
    createLeaveRequest
);

//user check own leave request
router.get(
    "/my",
    verifyToken,
    getMyLeaveRequests
);

//admin check all leave request
router.get(
    "/",
    verifyToken,
    requireRole("admin","company_super_admin"),
    getAllLeaveRequest
);

//admin approve or reject in status
router.patch(
    "/:id",
    verifyToken,
    requireRole("admin","company_super_admin"),
    updateLeaveRequestStatus
);

module.exports = router;