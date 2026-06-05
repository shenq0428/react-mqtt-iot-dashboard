const pool = require("../config/db");

// GET ALL COMPANIES
const getCompanies = async (req, res) => {
    try {

        const companies = await pool.query(
            `
            SELECT
                id,
                company_name
            FROM companies
            ORDER BY company_name
            `
        );

        res.status(200).json(companies.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }
};

module.exports = {
    getCompanies
};