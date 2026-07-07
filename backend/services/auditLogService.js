const auditLogRepository = require(
    "../repositories/auditLogRepository"
);

const getAuditLogs = async (query) => {
    let page = Number(query.page);
    let limit = Number(query.limit);

    if (!Number.isInteger(page) || page < 1) {
        page = 1;
    }

    if (!Number.isInteger(limit) || limit < 1) {
        limit = 20;
    }

    limit = Math.min(limit, 100);

    const action =
        typeof query.action === "string"
            ? query.action.trim()
            : "";

    const email =
        typeof query.email === "string"
            ? query.email.trim()
            : "";

    const offset = (page - 1) * limit;

    const [total, logs] = await Promise.all([
        auditLogRepository.countAuditLogs({
            action,
            email
        }),

        auditLogRepository.findAuditLogs({
            action,
            email,
            limit,
            offset
        })
    ]);

    return {
        logs,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

const createAuditLog = async (auditData, db) => {
    return auditLogRepository.createAuditLog(
        auditData,
        db
    );
};

module.exports = {
    getAuditLogs,
    createAuditLog
};