const auditLogService = require(
    "../services/auditLogService"
);

const getAuditLogs = async (req, res) => {
    try {
        const result = await auditLogService.getAuditLogs(
            req.query
        );

        return res.status(200).json(result);

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch audit logs"
        });
    }
};

module.exports = { getAuditLogs};