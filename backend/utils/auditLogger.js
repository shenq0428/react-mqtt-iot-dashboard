const auditLogService = require("../services/auditLogService");

const createAuditLog = async (auditData, db) => {
    try {
        return await auditLogService.createAuditLog(
            auditData,
            db
        );

    } catch (err) {
        console.error("Audit Log Error:", err);
    }
};

module.exports = { createAuditLog};
