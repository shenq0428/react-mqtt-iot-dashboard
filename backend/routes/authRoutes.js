const express = require("express");
const router = express.Router();

//从controllers/authController.js调用registerUser函数
const {  registerUser,} = require("../controllers/authController");

router.post("/register", registerUser);

module.exports = router;