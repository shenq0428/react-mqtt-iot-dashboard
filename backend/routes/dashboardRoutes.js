const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboardStatus, getRecentActivities, getRecentLoginActivities, getUserGrowth, getAuditSummary } = require("../controllers/dashboardController");

const express = require("express");
const router = express.Router();

//start from /api/dashboard/

router.get(
    "/stats",
    verifyToken,
    getDashboardStatus
);

router.get(
    "/recent-activities",
    verifyToken,
    getRecentActivities
)

router.get(
    "/recent-login-activities",
    verifyToken,
    getRecentLoginActivities
)

router.get(
    "/user-growth",
    verifyToken,
    getUserGrowth
);

router.get(
  "/audit-summary",
  verifyToken,
  getAuditSummary
);
module.exports = router;