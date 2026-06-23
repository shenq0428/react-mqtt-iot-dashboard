const pool = require("../config/db");
const { createAuditLog } = require("../utils/auditLogger");

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

//get specific company detail according choosen company id 
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
        SELECT 
        c.*,
        COUNT(u.id)::int AS total_users
        FROM companies c
        LEFT JOIN users u
        ON c.id = u.company_id
        WHERE c.id = $1
        GROUP BY c.id
        `,
            [id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "company not found" });
        }

        return res.status(200).json(result.rows[0]);

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "server not found ?" });
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
        // ====================
        // Company Name
        // ====================

        if (!company_name) { return res.status(400).json({ message: "Company name is required" }); }

        // ====================
        // Email Format
        // ====================

        if (company_email && !company_email.includes("@")
        ) {
            return res.status(400).json({ message: "Invalid company email" });
        }

        // ====================
        // Duplicate Email
        // ====================

        if (company_email) {

            const existingEmail = await pool.query(
                `
                SELECT *
                FROM companies
                WHERE company_email = $1
                `,
                [company_email]
            );

            if (existingEmail.rows.length > 0) {

                return res.status(400).json({ message: "Company email already exists" });

            }
        }

        // ====================
        // Duplicate Registration Number
        // ====================

        if (registration_number) {

            const existingRegistration = await pool.query(
                `
                SELECT *
                FROM companies
                WHERE registration_number = $1
                `,
                [registration_number]
            );

            if (existingRegistration.rows.length > 0) {
                return res.status(400).json({ message: "Registration number already exists" });
            }
        }

        // ====================
        // Duplicate Company Name
        // ====================

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

        await createAuditLog({
            actor_user_id: req.user.id,
            actor_username: req.user.username,
            actor_role: req.user.role,

            company_id: result.rows[0].id,

            action: "CREATE_COMPANY",

            target_type: "company",
            target_id: result.rows[0].id,

            description: `Created company ${result.rows[0].company_name}`,

            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            location: "Unknown",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Server error" });

    }
};

const updateCompany = async (req, res) => {
    try {

        const { id } = req.params;
        const oldCompanyResult = await pool.query(
            `
            SELECT *
            FROM companies
            WHERE id = $1
            `,
            [id]
        );

        if (oldCompanyResult.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        const oldCompany = oldCompanyResult.rows[0];

        const company_name = req.body.company_name ?? oldCompany.company_name;
        const company_email = req.body.company_email ?? oldCompany.company_email;
        const company_phone = req.body.company_phone ?? oldCompany.company_phone;
        const company_address = req.body.company_address ?? oldCompany.company_address;
        const registration_number = req.body.registration_number ?? oldCompany.registration_number;
        const status = req.body.status ?? oldCompany.status;

        // ====================
        // Email Format
        // ====================

        if (company_email && !company_email.includes("@")) {
            return res.status(400).json({ message: "Invalid company email" });
        }

        // ====================
        // Duplicate Email
        // ====================

        if (company_email) {

            const existingEmail = await pool.query(
                `
                SELECT *
                FROM companies
                WHERE company_email = $1
                AND id != $2
                `,
                [company_email, id]
            );

            if (existingEmail.rows.length > 0) {
                return res.status(400).json({ message: "Company email already exists" });
            }

        }

        // ====================
        // Duplicate Registration Number
        // ====================

        if (registration_number) {

            const existingRegistration =
                await pool.query(
                    `
                    SELECT *
                    FROM companies
                    WHERE registration_number = $1
                    AND id != $2
                    `,
                    [registration_number, id]
                );

            if (existingRegistration.rows.length > 0) {
                return res.status(400).json({ message: "Registration number already exists" });
            }

        }

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
            return res.status(404).json({ message: "Company not found" });
        }

        const updatedCompany = result.rows[0];

        //make change list to save the updated data for comparison
        let changes = [];
        //company_name
        if (oldCompany.company_name !== updatedCompany.company_name) { changes.push(`Company Name: ${oldCompany.company_name} → ${updatedCompany.company_name}`); }
        //email comparison
        if (oldCompany.company_email !== updatedCompany.company_email) { changes.push(`Email: ${oldCompany.company_email} → ${updatedCompany.company_email}`); }
        //phone comparison
        if (oldCompany.company_phone !== updatedCompany.company_phone) { changes.push(`Phone: ${oldCompany.company_phone} → ${updatedCompany.company_phone}`); }
        //address comparison
        if (oldCompany.company_address !== updatedCompany.company_address) { changes.push(`Address: ${oldCompany.company_address} → ${updatedCompany.company_address}`); }
        //registration comparison
        if (oldCompany.registration_number !== updatedCompany.registration_number) { changes.push(`Registration Number: ${oldCompany.registration_number} → ${updatedCompany.registration_number}`); }
        //status comparison
        if (oldCompany.status !== updatedCompany.status) { changes.push(`Status: ${oldCompany.status} → ${updatedCompany.status}`); }

        if (changes.length === 0) {
            return res.status(200).json({ message: "No changes detected" })
        }

        await createAuditLog({
            actor_user_id: req.user.id,
            actor_username: req.user.username,
            actor_role: req.user.role,

            company_id: result.rows[0].id,

            action: "UPDATE_COMPANY",

            target_type: "company",
            target_id: result.rows[0].id,

            description: `Updated company  ${updatedCompany.company_name}\n\n${changes.join("\n")}`,


            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            location: "Unknown",
        });

        /*
        console.log(`Updated company ${updatedCompany.company_name}\n\n${changes.join("\n")}`);
        */
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

        await createAuditLog({
            actor_user_id: req.user.id,
            actor_username: req.user.username,
            actor_role: req.user.role,

            company_id: result.rows[0].id,

            action: "DEACTIVATE_COMPANY",

            target_type: "company",
            target_id: result.rows[0].id,

            description: `Deactivated company ${result.rows[0].company_name}`,

            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            location: "Unknown",
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({ message: "Server error" });
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

        await createAuditLog({
            actor_user_id: req.user.id,
            actor_username: req.user.username,
            actor_role: req.user.role,

            company_id: result.rows[0].id,

            action: "DELETE_COMPANY",

            target_type: "company",
            target_id: result.rows[0].id,

            description: `Deleted company ${result.rows[0].company_name}`,

            ip_address: req.ip,
            user_agent: req.headers["user-agent"],
            location: "Unknown",
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { getCompanies, getCompanyById, createCompany, updateCompany, deactivateCompany, deleteCompany };