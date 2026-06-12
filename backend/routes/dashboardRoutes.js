const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboardStatus, getRecentActivities, getRecentLoginActivities} = require("../controllers/dashboardController");

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
module.exports = router;