const express = require("express");

const router = express.Router();

const {   getCompanies} = require("../controllers/companyController");

const { verifyToken} = require("../middleware/authMiddleware");

// GET /api/companies
router.get(
    "/",
    verifyToken,
    getCompanies
);

module.exports = router;