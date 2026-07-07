const pool = require("../config/db");
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");
const { createAuditLog } = require("../utils/auditLogger");

const VALID_ROLES = ["user", "admin", "superadmin"];
const VALID_PRIVILEGE_TYPES = ["permanent", "temporary"];

const createAppError = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const parseUserId = (value) => {
    const userId = Number(value);

    if (!Number.isInteger(userId) || userId < 1) {
        throw createAppError(400, "Invalid user id");
    }

    return userId;
};

const withTransaction = async (work) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const result = await work(client);
        await client.query("COMMIT");
        return result;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const normalizeUserData = (userData, { requirePassword = false } = {}) => {
    let {
        username,
        email,
        password,
        role,
        privilege_type,
        expires_at,
        phone_number,
        company_id
    } = userData;

    const requiredFields = requirePassword
        ? [username, email, password, role, privilege_type]
        : [username, email, role, privilege_type];

    if (requiredFields.some((field) => !field)) {
        throw createAppError(400, "Required fields missing");
    }

    if (!VALID_ROLES.includes(role)) {
        throw createAppError(400, "Invalid role");
    }

    if (!VALID_PRIVILEGE_TYPES.includes(privilege_type)) {
        throw createAppError(400, "Invalid privilege type");
    }

    if (privilege_type === "temporary" && !expires_at) {
        throw createAppError(400, "Temporary account requires expiry date");
    }

    if (privilege_type === "permanent") {
        expires_at = null;
    }

    return {
        username,
        email,
        password,
        role,
        privilegeType: privilege_type,
        expiresAt: expires_at,
        phoneNumber: phone_number,
        companyId: company_id
    };
};

const buildAuditData = ({
    actor,
    requestMeta,
    action,
    targetId,
    description
}) => ({
    actor_user_id: actor.id,
    actor_username: actor.username || null,
    actor_role: actor.role,
    company_id: actor.company_id,
    action,
    target_type: "user",
    target_id: targetId,
    description,
    ip_address: requestMeta.ip_address,
    user_agent: requestMeta.user_agent,
    location: requestMeta.location
});

const getUsers = async (actor) => {
    if (actor.role === "superadmin") {
        return userRepository.findAllUsers();
    }

    return userRepository.findUsersByCompanyId(actor.company_id);
};

const createUser = async ({ userData, actor, requestMeta }) => {
    const normalizedUser = normalizeUserData(userData, {
        requirePassword: true
    });

    if (actor.role === "admin" && normalizedUser.role !== "user") {
        throw createAppError(403, "Admin can only create users");
    }

    if (normalizedUser.role === "superadmin") {
        throw createAppError(403, "Cannot create superadmin account");
    }

    return withTransaction(async (db) => {
        const existingUsername = await userRepository.findUserByUsername(
            normalizedUser.username,
            db
        );

        if (existingUsername) {
            throw createAppError(400, "Username already exists");
        }

        const existingEmail = await userRepository.findUserByEmail(
            normalizedUser.email,
            db
        );

        if (existingEmail) {
            throw createAppError(400, "Email already exists");
        }

        const passwordHash = await bcrypt.hash(normalizedUser.password, 10);

        const newUser = await userRepository.insertUser(
            {
                ...normalizedUser,
                passwordHash
            },
            db
        );

        await createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                action: "CREATE_USER",
                targetId: newUser.id,
                description: `Created ${newUser.role} account ${newUser.username} (ID:${newUser.id})`
            }),
            db
        );

        return newUser;
    });
};

const updateUserStatus = async ({ userId, status, actor, requestMeta }) => {
    const parsedUserId = parseUserId(userId);

    if (status !== "active" && status !== "inactive") {
        throw createAppError(400, "Invalid status");
    }

    return withTransaction(async (db) => {
        const targetUser = await userRepository.findUserById(parsedUserId, db);

        if (!targetUser) {
            throw createAppError(404, "User not found");
        }

        if (targetUser.role === "superadmin") {
            throw createAppError(403, "Cannot modify superadmin account");
        }

        if (targetUser.status === status) {
            throw createAppError(400, "No status changes");
        }

        const updatedUser = await userRepository.updateUserStatusById(
            parsedUserId,
            status,
            db
        );

        await createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                action: "UPDATE_USER_STATUS",
                targetId: parsedUserId,
                description: `Changed status from ${targetUser.status} to ${status} for ${targetUser.role} account ${targetUser.username} (ID:${parsedUserId})`
            }),
            db
        );

        return updatedUser;
    });
};

const updateUser = async ({ userId, userData, actor, requestMeta }) => {
    const parsedUserId = parseUserId(userId);
    const normalizedUser = normalizeUserData(userData);

    return withTransaction(async (db) => {
        const oldUser = await userRepository.findUserById(parsedUserId, db);

        if (!oldUser) {
            throw createAppError(404, "User not found");
        }

        const existingUsername = await userRepository.findUserByUsernameExcludingId(
            normalizedUser.username,
            parsedUserId,
            db
        );

        if (existingUsername) {
            throw createAppError(400, "Username already exists");
        }

        const existingEmail = await userRepository.findUserByEmailExcludingId(
            normalizedUser.email,
            parsedUserId,
            db
        );

        if (existingEmail) {
            throw createAppError(400, "Email already exists");
        }

        if (oldUser.role === "superadmin") {
            throw createAppError(403, "Cannot modify superadmin account");
        }

        if (actor.role === "admin") {
            if (Number(oldUser.company_id) !== Number(actor.company_id)) {
                throw createAppError(
                    403,
                    "Cannot modify users from another company"
                );
            }

            if (oldUser.role !== "user") {
                throw createAppError(403, "Admin can only modify users");
            }

            if (normalizedUser.role !== oldUser.role) {
                throw createAppError(403, "Admin cannot modify roles");
            }

            if (Number(normalizedUser.companyId) !== Number(oldUser.company_id)) {
                throw createAppError(403, "Admin cannot change company");
            }
        }

        const changes = [];

        if (oldUser.username !== normalizedUser.username) {
            changes.push(
                `username from ${oldUser.username} to ${normalizedUser.username}`
            );
        }

        if (oldUser.email !== normalizedUser.email) {
            changes.push(`email from ${oldUser.email} to ${normalizedUser.email}`);
        }

        if (oldUser.role !== normalizedUser.role) {
            changes.push(`role from ${oldUser.role} to ${normalizedUser.role}`);
        }

        if (Number(oldUser.company_id) !== Number(normalizedUser.companyId)) {
            changes.push(
                `company from ${oldUser.company_id} to ${normalizedUser.companyId}`
            );
        }

        if (oldUser.privilege_type !== normalizedUser.privilegeType) {
            changes.push(
                `privilege type from ${oldUser.privilege_type} to ${normalizedUser.privilegeType}`
            );
        }

        if (String(oldUser.expires_at) !== String(normalizedUser.expiresAt)) {
            changes.push("expiry date updated");
        }

        if (changes.length === 0) {
            throw createAppError(400, "No changes detected");
        }

        const updatedUser = await userRepository.updateUserById(
            parsedUserId,
            normalizedUser,
            db
        );

        await createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                action: "UPDATE_USER",
                targetId: parsedUserId,
                description: `Updated user ID ${parsedUserId}: ${changes.join(", ")}`
            }),
            db
        );

        return updatedUser;
    });
};

const deleteUser = async ({ userId, actor, requestMeta }) => {
    const parsedUserId = parseUserId(userId);

    if (Number(actor.id) === parsedUserId) {
        throw createAppError(400, "Cannot delete your own account");
    }

    return withTransaction(async (db) => {
        const targetUser = await userRepository.findUserById(parsedUserId, db);

        if (!targetUser) {
            throw createAppError(404, "User not found");
        }

        if (targetUser.role === "superadmin") {
            throw createAppError(403, "Cannot delete superadmin account");
        }

        const deletedUser = await userRepository.deleteUserById(parsedUserId, db);

        await createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                action: "DELETE_USER",
                targetId: parsedUserId,
                description: `Deleted ${targetUser.role} account ${targetUser.username} (ID: ${parsedUserId})`
            }),
            db
        );

        return deletedUser;
    });
};

module.exports = {
    getUsers,
    createUser,
    updateUserStatus,
    updateUser,
    deleteUser
};
