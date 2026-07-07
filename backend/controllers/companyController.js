const companyService = require(
    "../services/companyService"
);

const getRequestMeta = (req) => {
    return {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] || null
    };
};

const handleError = (res, err) => {
    console.error(err);

    return res.status(err.statusCode || 500).json({
        message: err.statusCode
            ? err.message
            : "Server error"
    });
};

const getCompanies = async (req, res) => {
    try {
        const companies =
            await companyService.getCompanies();

        return res.status(200).json(companies);

    } catch (err) {
        return handleError(res, err);
    }
};

const getCompanyById = async (req, res) => {
    try {
        const company =
            await companyService.getCompanyById(
                req.params.id
            );

        return res.status(200).json(company);

    } catch (err) {
        return handleError(res, err);
    }
};

const createCompany = async (req, res) => {
    try {
        const company =
            await companyService.createCompany({
                companyData: req.body,
                actor: req.user,
                requestMeta: getRequestMeta(req)
            });

        return res.status(201).json({
            message: "Company created successfully",
            company
        });

    } catch (err) {
        return handleError(res, err);
    }
};

const updateCompany = async (req, res) => {
    try {
        const company =
            await companyService.updateCompany({
                id: req.params.id,
                companyData: req.body,
                actor: req.user,
                requestMeta: getRequestMeta(req)
            });

        return res.status(200).json({
            message: "Company updated successfully",
            company
        });

    } catch (err) {
        return handleError(res, err);
    }
};

const deactivateCompany = async (req, res) => {
    try {
        const company =
            await companyService.deactivateCompany({
                id: req.params.id,
                actor: req.user,
                requestMeta: getRequestMeta(req)
            });

        return res.status(200).json({
            message: "Company deactivated successfully",
            company
        });

    } catch (err) {
        return handleError(res, err);
    }
};

const deleteCompany = async (req, res) => {
    try {
        const company =
            await companyService.deleteCompany({
                id: req.params.id,
                actor: req.user,
                requestMeta: getRequestMeta(req)
            });

        return res.status(200).json({
            message: "Company deleted successfully",
            company
        });

    } catch (err) {
        return handleError(res, err);
    }
};

module.exports = {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deactivateCompany,
    deleteCompany
};