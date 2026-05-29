//调用authRoutes给server.js使用
const express = require("express");
const router = express.Router();

//从controllers/authController.js调用registerUser函数
const {  registerUser, loginUser} = require("../controllers/authController");

const { verifyToken } = require("../middleware/authMiddleware");

router.get(
    "/protected",
    verifyToken,
    (req, res) => {
        res.status(200).json({
            message: "Protected Route Accessed",
            user: req.user,
        });
    }
);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;