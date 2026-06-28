const { verifyToken } = require("../middleware/authMiddleware");
const { createLeaveRequest, getMyLeaveRequests, getAllLeaveRequest, updateLeaveRequestStatus, getLeaveRequestById, updateLeaveRequest, cancelLeaveRequest } = require("../controllers/leaveRequestController");
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

//user view 1 leave request
router.get(
    "/:id",
    verifyToken,
    getLeaveRequestById
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
    "/:id/status",
    verifyToken,
    requireRole("admin","company_super_admin"),
    updateLeaveRequestStatus
);

//user edit own request 
router.put(
    "/:id",
    verifyToken,
    updateLeaveRequest
);

//user cancel own request when status still in pending
router.patch(
    "/:id/cancel",
    verifyToken,
    cancelLeaveRequest
)
module.exports = router;