const pool = require("../config/db");

// GET ALL COMPANIES
const getCompanies = async (req, res) => {
    try {

        const companies = await pool.query(`
            SELECT
                c.id,
                c.company_name,
                c.company_email,
                c.company_phone,
                c.status,
                c.created_at,

                COUNT(u.id)::int AS total_users

            FROM companies c

            LEFT JOIN users u
            ON c.id = u.company_id

            GROUP BY c.id

            ORDER BY c.id DESC
        `);

        res.status(200).json(companies.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Server error" });

    }
};

const createCompany = async (req, res) => {
    try {

        const {
            company_name,
            company_email,
            company_phone,
            company_address,
            registration_number
        } = req.body;

        if (!company_name) {
            return res.status(400).json({
                message: "Company name is required"
            });
        }

        const existingCompany = await pool.query(
            `
            SELECT *
            FROM companies
            WHERE company_name = $1
            `,
            [company_name]
        );

        if (existingCompany.rows.length > 0) {
            return res.status(400).json({
                message: "Company already exists"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO companies (
                company_name,
                company_email,
                company_phone,
                company_address,
                registration_number
            )
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
            `,
            [
                company_name,
                company_email,
                company_phone,
                company_address,
                registration_number
            ]
        );

        res.status(201).json({
            message: "Company created successfully",
            company: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }
};

const updateCompany = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            company_name,
            company_email,
            company_phone,
            company_address,
            registration_number,
            status
        } = req.body;

        const result = await pool.query(
            `
            UPDATE companies
            SET
                company_name = $1,
                company_email = $2,
                company_phone = $3,
                company_address = $4,
                registration_number = $5,
                status = $6
            WHERE id = $7
            RETURNING *
            `,
            [
                company_name,
                company_email,
                company_phone,
                company_address,
                registration_number,
                status,
                id
            ]
        );

        //避免 用户输入id=999 没有报错
        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.status(200).json({
            message: "Company updated successfully",
            company: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });

    }
};

const deactivateCompany = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE companies
            SET status = 'inactive'
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({
            message: "Company deactivated successfully",
            company: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteCompany = async (req, res) => {
    try {

        const { id } = req.params;

        const users = await pool.query(
            `
            SELECT COUNT(*)::int AS total
            FROM users
            WHERE company_id = $1
            `,
            [id]
        );

        if (users.rows[0].total > 0) {
            return res.status(400).json({ message: "Cannot delete company with existing users" });
        }

        const result = await pool.query(
            `
                DELETE FROM companies
                where id =$1
                RETURNING *
                `,
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.status(200).json({
            message: "Company deleted successfully",
            company: result.rows[0]
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
}

module.exports = { getCompanies, createCompany, updateCompany, deactivateCompany, deleteCompany };