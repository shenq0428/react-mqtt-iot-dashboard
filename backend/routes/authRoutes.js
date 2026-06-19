//调用authRoutes给server.js使用
const express = require("express");
const router = express.Router();

//从controllers/authController.js调用registerUser函数
const { registerUser, loginUser, getCurrentUser, logoutUser } = require("../controllers/authController");

//调用verifyToken函数来重复验证token的有效性，保护路由
const { verifyToken } = require("../middleware/authMiddleware");

const { checkAdmin } = require("../middleware/authAdminMiddleware");

//start from /api/auth
router.get("/protected", verifyToken, (req, res) => {
    res.status(200).json({
        message: "Protected Route Accessed",
        user: req.user,
    });
}
);

router.get("/adminTest", verifyToken, checkAdmin, (req, res) => {
    res.status(200).json({
        message: "Admin Route Accessed",
        user: req.user,
    });
}
);

router.get("/me", verifyToken, getCurrentUser);


router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", verifyToken, logoutUser);

module.exports = router;