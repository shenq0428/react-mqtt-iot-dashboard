const { verifyToken } = require("../middleware/authMiddleware");
const { getDashboardStatus } = require("../controllers/dashboardController");

const express = require("express");
const router = express.Router();

//start from /api/dashboard/

router.get(
    "/stats",
    verifyToken,
    getDashboardStatus
);

module.exports = router;