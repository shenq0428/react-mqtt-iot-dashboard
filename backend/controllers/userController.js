const userService = require("../services/userService");

const getRequestMeta = (req) => ({
    ip_address: req.ip,
    user_agent: req.get("user-agent") || null,
    location: "Unknown"
});

const handleError = (res, error) => {
    const statusCode = error.statusCode || 500;

    if (statusCode === 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        message: statusCode === 500 ? "Server error" : error.message
    });
};

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser({
            userData: req.body,
            actor: req.user,
            requestMeta: getRequestMeta(req)
        });

        return res.status(201).json({
            message: `User ${user.username} created successfully`,
            user
        });
    } catch (error) {
        return handleError(res, error);
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers(req.user);

        return res.status(200).json(users);
    } catch (error) {
        return handleError(res, error);
    }
};

const updateUserStatus = async (req, res) => {
    try {
        const user = await userService.updateUserStatus({
            userId: req.params.id,
            status: req.body.status,
            actor: req.user,
            requestMeta: getRequestMeta(req)
        });

        return res.status(200).json(user);
    } catch (error) {
        return handleError(res, error);
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser({
            userId: req.params.id,
            userData: req.body,
            actor: req.user,
            requestMeta: getRequestMeta(req)
        });

        return res.status(200).json({
            message: "User updated successfully",
            user
        });
    } catch (error) {
        return handleError(res, error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser({
            userId: req.params.id,
            actor: req.user,
            requestMeta: getRequestMeta(req)
        });

        return res.status(200).json(user);
    } catch (error) {
        return handleError(res, error);
    }
};

module.exports = {
    createUser,
    getUsers,
    updateUserStatus,
    updateUser,
    deleteUser
};
