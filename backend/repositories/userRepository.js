const pool = require("../config/db");

// This list deliberately excludes password_hash so it is never returned to the frontend.
const SAFE_USER_COLUMNS = `
    id,
    username,
    email,
    role,
    phone_number,
    company_id,
    privilege_type,
    expires_at,
    status,
    created_at,
    updated_at
`;

const findAllUsers = async (db = pool) => {
    const result = await db.query(`
        SELECT
            u.id,
            u.username,
            u.email,
            u.role,
            u.phone_number,
            u.company_id,
            u.privilege_type,
            u.expires_at,
            u.status,
            c.company_name
        FROM users u
        LEFT JOIN companies c
            ON u.company_id = c.id
        ORDER BY u.id ASC
    `);

    return result.rows;
};

const findUsersByCompanyId = async (companyId, db = pool) => {
    const result = await db.query(
        `
        SELECT
            u.id,
            u.username,
            u.email,
            u.role,
            u.phone_number,
            u.company_id,
            u.privilege_type,
            u.expires_at,
            u.status,
            c.company_name
        FROM users u
        LEFT JOIN companies c
            ON u.company_id = c.id
        WHERE u.company_id = $1
        ORDER BY u.id ASC
        `,
        [companyId]
    );

    return result.rows;
};

const findUserById = async (userId, db = pool) => {
    const result = await db.query(
        `
        SELECT
            id,
            username,
            email,
            role,
            phone_number,
            company_id,
            privilege_type,
            expires_at,
            status
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0] || null;
};

const findUserByUsername = async (username, db = pool) => {
    const result = await db.query(
        "SELECT id FROM users WHERE username = $1",
        [username]
    );

    return result.rows[0] || null;
};

const findUserByEmail = async (email, db = pool) => {
    const result = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    return result.rows[0] || null;
};

const findUserByUsernameExcludingId = async (username, userId, db = pool) => {
    const result = await db.query(
        `
        SELECT id
        FROM users
        WHERE username = $1
          AND id != $2
        `,
        [username, userId]
    );

    return result.rows[0] || null;
};

const findUserByEmailExcludingId = async (email, userId, db = pool) => {
    const result = await db.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
          AND id != $2
        `,
        [email, userId]
    );

    return result.rows[0] || null;
};

const insertUser = async (userData, db = pool) => {
    const {
        username,
        email,
        passwordHash,
        role,
        privilegeType,
        expiresAt,
        phoneNumber,
        companyId
    } = userData;

    const result = await db.query(
        `
        INSERT INTO users (
            username,
            email,
            password_hash,
            role,
            privilege_type,
            expires_at,
            phone_number,
            company_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING ${SAFE_USER_COLUMNS}
        `,
        [
            username,
            email,
            passwordHash,
            role,
            privilegeType,
            expiresAt,
            phoneNumber,
            companyId
        ]
    );

    return result.rows[0];
};

const updateUserStatusById = async (userId, status, db = pool) => {
    const result = await db.query(
        `
        UPDATE users
        SET
            status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING ${SAFE_USER_COLUMNS}
        `,
        [status, userId]
    );

    return result.rows[0] || null;
};

const updateUserById = async (userId, userData, db = pool) => {
    const {
        username,
        email,
        phoneNumber,
        companyId,
        role,
        privilegeType,
        expiresAt
    } = userData;

    const result = await db.query(
        `
        UPDATE users
        SET
            username = $1,
            email = $2,
            phone_number = $3,
            company_id = $4,
            role = $5,
            privilege_type = $6,
            expires_at = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING ${SAFE_USER_COLUMNS}
        `,
        [
            username,
            email,
            phoneNumber,
            companyId,
            role,
            privilegeType,
            expiresAt,
            userId
        ]
    );

    return result.rows[0] || null;
};

const deleteUserById = async (userId, db = pool) => {
    const result = await db.query(
        `
        DELETE FROM users
        WHERE id = $1
        RETURNING ${SAFE_USER_COLUMNS}
        `,
        [userId]
    );

    return result.rows[0] || null;
};

module.exports = {
    findAllUsers,
    findUsersByCompanyId,
    findUserById,
    findUserByUsername,
    findUserByEmail,
    findUserByUsernameExcludingId,
    findUserByEmailExcludingId,
    insertUser,
    updateUserStatusById,
    updateUserById,
    deleteUserById
};
