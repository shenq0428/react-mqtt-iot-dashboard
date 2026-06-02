// routes/userRoutes.js start from /api/users
const { verifyToken } = require("../middleware/authMiddleware");
const { getUsers } = require("../controllers/authController");
const { requireRole } = require("../middleware/roleMiddleware");

const express = require("express");
const router = express.Router();

//用了两个middelware里的function和一个controllers里的function 来保护这个路由，只有admin和superadmin角色的用户才能访问这个路由
router.get( "/", verifyToken, requireRole("admin","superadmin"), getUsers );

module.exports = router;