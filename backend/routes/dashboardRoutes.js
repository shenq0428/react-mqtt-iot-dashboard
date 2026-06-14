const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboardStatus, getRecentActivities, getRecentLoginActivities, getUserGrowth, getAuditSummary } = require("../controllers/dashboardController");
const { requireRole } = require("../middleware/roleMiddleware");
const express = require("express");
const router = express.Router();

//start from /api/dashboard/

router.get(
    "/stats",
    verifyToken,
    requireRole("superadmin"),
    getDashboardStatus
);

router.get(
    "/recent-activities",
    verifyToken,
    requireRole("superadmin"),
    getRecentActivities
)

router.get(
    "/recent-login-activities",
    verifyToken,
    requireRole("superadmin"),
    getRecentLoginActivities
)

router.get(
    "/user-growth",
    verifyToken,
    requireRole("superadmin"),
    getUserGrowth
);

router.get(
    "/audit-summary",
    verifyToken,
    requireRole("superadmin"),
    getAuditSummary
);
module.exports = router;