const express = require("express");
const router = express.Router();
const { getAuditLogs } = require("../controllers/auditController");
const { verifyToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get(
    "/",
    verifyToken,
    requireRole("admin", "superadmin"),
    getAuditLogs
);

module.exports = router;