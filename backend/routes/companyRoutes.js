const express = require("express");

const router = express.Router();

const { getCompanies,getCompanyById, createCompany, updateCompany, deactivateCompany, deleteCompany } = require("../controllers/companyController");

const { verifyToken } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// GET /api/companies
router.get(
    "/",
    verifyToken,
    getCompanies
);

router.get(
    "/:id",
    verifyToken,
    getCompanyById
)
router.post(
    "/",
    verifyToken,
    requireRole("superadmin"),
    createCompany,
);

router.patch(
    "/:id",
    verifyToken,
    requireRole("superadmin"),
    updateCompany,
);

router.patch(
    "/:id/deactivate",
    verifyToken,
    requireRole("superadmin"),
    deactivateCompany
);

router.delete(
      "/:id",
      verifyToken,
    requireRole("superadmin"),
    deleteCompany
 );
module.exports = router;