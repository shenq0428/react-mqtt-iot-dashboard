const pool = require("../config/db");

const findAllWithUserCount = async (db = pool) => {
    const result = await db.query(`
        SELECT
            c.id,
            c.company_name,
            c.short_name,
            c.company_email,
            c.company_phone,
            c.company_address,
            c.registration_number,
            c.industry,
            c.status,
            c.created_at,
            c.updated_at,

            COUNT(u.id)::int AS total_users

        FROM companies c

        LEFT JOIN users u
            ON c.id = u.company_id

        GROUP BY c.id

        ORDER BY c.id DESC
    `);

    return result.rows;
};

const findById = async (id, db = pool) => {
    const result = await db.query(
        `
        SELECT *
        FROM companies
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] || null;
};

const findByIdWithUserCount = async (id, db = pool) => {
    const result = await db.query(
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
    );

    return result.rows[0] || null;
};

const findByCompanyName = async (
    companyName,
    excludeId = null,
    db = pool
) => {
    const result = await db.query(
        excludeId
            ? `
                SELECT id
                FROM companies
                WHERE LOWER(company_name) = LOWER($1)
                AND id != $2
            `
            : `
                SELECT id
                FROM companies
                WHERE LOWER(company_name) = LOWER($1)
            `,
        excludeId
            ? [companyName, excludeId]
            : [companyName]
    );

    return result.rows[0] || null;
};

const findByShortName = async (
    shortName,
    excludeId = null,
    db = pool
) => {
    const result = await db.query(
        excludeId
            ? `
                SELECT id
                FROM companies
                WHERE LOWER(short_name) = LOWER($1)
                AND id != $2
            `
            : `
                SELECT id
                FROM companies
                WHERE LOWER(short_name) = LOWER($1)
            `,
        excludeId
            ? [shortName, excludeId]
            : [shortName]
    );

    return result.rows[0] || null;
};

const findByEmail = async (
    email,
    excludeId = null,
    db = pool
) => {
    const result = await db.query(
        excludeId
            ? `
                SELECT id
                FROM companies
                WHERE LOWER(company_email) = LOWER($1)
                AND id != $2
            `
            : `
                SELECT id
                FROM companies
                WHERE LOWER(company_email) = LOWER($1)
            `,
        excludeId
            ? [email, excludeId]
            : [email]
    );

    return result.rows[0] || null;
};

const findByRegistrationNumber = async (
    registrationNumber,
    excludeId = null,
    db = pool
) => {
    const result = await db.query(
        excludeId
            ? `
                SELECT id
                FROM companies
                WHERE registration_number = $1
                AND id != $2
            `
            : `
                SELECT id
                FROM companies
                WHERE registration_number = $1
            `,
        excludeId
            ? [registrationNumber, excludeId]
            : [registrationNumber]
    );

    return result.rows[0] || null;
};

const createCompany = async (companyData, db = pool) => {
    const {
        company_name,
        short_name,
        company_email,
        company_phone,
        company_address,
        registration_number,
        industry,
        status
    } = companyData;

    const result = await db.query(
        `
        INSERT INTO companies (
            company_name,
            short_name,
            company_email,
            company_phone,
            company_address,
            registration_number,
            industry,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `,
        [
            company_name,
            short_name,
            company_email,
            company_phone,
            company_address,
            registration_number,
            industry,
            status
        ]
    );

    return result.rows[0];
};

const updateCompany = async (
    id,
    companyData,
    db = pool
) => {
    const {
        company_name,
        short_name,
        company_email,
        company_phone,
        company_address,
        registration_number,
        industry,
        status
    } = companyData;

    const result = await db.query(
        `
        UPDATE companies
        SET
            company_name = $1,
            short_name = $2,
            company_email = $3,
            company_phone = $4,
            company_address = $5,
            registration_number = $6,
            industry = $7,
            status = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
        `,
        [
            company_name,
            short_name,
            company_email,
            company_phone,
            company_address,
            registration_number,
            industry,
            status,
            id
        ]
    );

    return result.rows[0] || null;
};

const updateStatus = async (id, status, db = pool) => {
    const result = await db.query(
        `
        UPDATE companies
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
    );

    return result.rows[0] || null;
};

const countUsersByCompanyId = async (id, db = pool) => {
    const result = await db.query(
        `
        SELECT COUNT(*)::int AS total
        FROM users
        WHERE company_id = $1
        `,
        [id]
    );

    return result.rows[0].total;
};

const countLeaveRequestsByCompanyId = async (
    id,
    db = pool
) => {
    const result = await db.query(
        `
        SELECT COUNT(*)::int AS total
        FROM leave_requests
        WHERE company_id = $1
        `,
        [id]
    );

    return result.rows[0].total;
};

const deleteCompany = async (id, db = pool) => {
    const result = await db.query(
        `
        DELETE FROM companies
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    return result.rows[0] || null;
};

module.exports = {
    findAllWithUserCount,
    findById,
    findByIdWithUserCount,
    findByCompanyName,
    findByShortName,
    findByEmail,
    findByRegistrationNumber,
    createCompany,
    updateCompany,
    updateStatus,
    countUsersByCompanyId,
    countLeaveRequestsByCompanyId,
    deleteCompany
};