const pool = require("../config/db");

const AppError = require("../utils/appError");

const companyRepository = require(
    "../repositories/companyRepository"
);

const auditLogService = require(
    "./auditLogService"
);

const normalizeOptionalText = (value) => {
    if (value === undefined || value === null) {
        return null;
    }

    const normalized = String(value).trim();

    return normalized || null;
};

const normalizeCompanyData = (
    input,
    existingCompany = null
) => {
    const getValue = (fieldName) => {
        if (Object.prototype.hasOwnProperty.call(input, fieldName)) {
            return input[fieldName];
        }

        return existingCompany
            ? existingCompany[fieldName]
            : undefined;
    };

    const companyName = normalizeOptionalText(
        getValue("company_name")
    );

    const shortName = normalizeOptionalText(
        getValue("short_name")
    );

    const companyEmail = normalizeOptionalText(
        getValue("company_email")
    )?.toLowerCase() || null;

    const companyPhone = normalizeOptionalText(
        getValue("company_phone")
    );

    const companyAddress = normalizeOptionalText(
        getValue("company_address")
    );

    const registrationNumber = normalizeOptionalText(
        getValue("registration_number")
    );

    const industry = normalizeOptionalText(
        getValue("industry")
    );

    const status =
        normalizeOptionalText(getValue("status")) ||
        "active";

    if (!companyName) {
        throw new AppError(
            "Company name is required.",
            400
        );
    }

    if (!shortName) {
        throw new AppError(
            "Short name is required.",
            400
        );
    }

    if (
        companyEmail &&
        !companyEmail.includes("@")
    ) {
        throw new AppError(
            "Invalid company email.",
            400
        );
    }

    if (!["active", "inactive"].includes(status)) {
        throw new AppError(
            "Invalid company status.",
            400
        );
    }

    return {
        company_name: companyName,
        short_name: shortName,
        company_email: companyEmail,
        company_phone: companyPhone,
        company_address: companyAddress,
        registration_number: registrationNumber,
        industry,
        status
    };
};

const ensureCompanyIsUnique = async (
    companyData,
    excludeId,
    db
) => {
    const [
        existingName,
        existingShortName,
        existingEmail,
        existingRegistration
    ] = await Promise.all([
        companyRepository.findByCompanyName(
            companyData.company_name,
            excludeId,
            db
        ),

        companyRepository.findByShortName(
            companyData.short_name,
            excludeId,
            db
        ),

        companyData.company_email
            ? companyRepository.findByEmail(
                companyData.company_email,
                excludeId,
                db
            )
            : Promise.resolve(null),

        companyData.registration_number
            ? companyRepository.findByRegistrationNumber(
                companyData.registration_number,
                excludeId,
                db
            )
            : Promise.resolve(null)
    ]);

    if (existingName) {
        throw new AppError(
            "Company already exists.",
            400
        );
    }

    if (existingShortName) {
        throw new AppError(
            "Short name already exists.",
            400
        );
    }

    if (existingEmail) {
        throw new AppError(
            "Company email already exists.",
            400
        );
    }

    if (existingRegistration) {
        throw new AppError(
            "Registration number already exists.",
            400
        );
    }
};

const buildChanges = (oldCompany, newCompany) => {
    const changes = [];

    const fields = [
        ["company_name", "Company Name"],
        ["short_name", "Short Name"],
        ["company_email", "Email"],
        ["company_phone", "Phone"],
        ["company_address", "Address"],
        ["registration_number", "Registration Number"],
        ["industry", "Industry"],
        ["status", "Status"]
    ];

    for (const [fieldName, label] of fields) {
        const oldValue = oldCompany[fieldName] || "-";
        const newValue = newCompany[fieldName] || "-";

        if (oldValue !== newValue) {
            changes.push(
                `${label}: ${oldValue} → ${newValue}`
            );
        }
    }

    return changes;
};

const buildAuditData = ({
    actor,
    requestMeta,
    companyId,
    action,
    targetId,
    description
}) => {
    return {
        actor_user_id: actor.id,
        actor_username: actor.username,
        actor_role: actor.role,
        company_id: companyId,
        action,
        target_type: "company",
        target_id: targetId,
        description,
        ip_address: requestMeta.ipAddress,
        user_agent: requestMeta.userAgent,
        location: "Unknown"
    };
};

const getCompanies = async () => {
    return companyRepository.findAllWithUserCount();
};

const getCompanyById = async (id) => {
    const company =
        await companyRepository.findByIdWithUserCount(id);

    if (!company) {
        throw new AppError(
            "Company not found.",
            404
        );
    }

    return company;
};

const createCompany = async ({
    companyData,
    actor,
    requestMeta
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const normalizedCompany =
            normalizeCompanyData(companyData);

        await ensureCompanyIsUnique(
            normalizedCompany,
            null,
            client
        );

        const company =
            await companyRepository.createCompany(
                normalizedCompany,
                client
            );

        await auditLogService.createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                companyId: company.id,
                action: "CREATE_COMPANY",
                targetId: company.id,
                description:
                    `Created company ${company.company_name}`
            }),
            client
        );

        await client.query("COMMIT");

        return company;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;

    } finally {
        client.release();
    }
};

const updateCompany = async ({
    id,
    companyData,
    actor,
    requestMeta
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const oldCompany =
            await companyRepository.findById(id, client);

        if (!oldCompany) {
            throw new AppError(
                "Company not found.",
                404
            );
        }

        const normalizedCompany =
            normalizeCompanyData(
                companyData,
                oldCompany
            );

        const changes = buildChanges(
            oldCompany,
            normalizedCompany
        );

        if (changes.length === 0) {
            throw new AppError(
                "No changes detected.",
                400
            );
        }

        await ensureCompanyIsUnique(
            normalizedCompany,
            id,
            client
        );

        const updatedCompany =
            await companyRepository.updateCompany(
                id,
                normalizedCompany,
                client
            );

        await auditLogService.createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                companyId: updatedCompany.id,
                action: "UPDATE_COMPANY",
                targetId: updatedCompany.id,
                description:
                    `Updated company ${updatedCompany.company_name}\n\n${changes.join("\n")}`
            }),
            client
        );

        await client.query("COMMIT");

        return updatedCompany;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;

    } finally {
        client.release();
    }
};

const deactivateCompany = async ({
    id,
    actor,
    requestMeta
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const company =
            await companyRepository.findById(id, client);

        if (!company) {
            throw new AppError(
                "Company not found.",
                404
            );
        }

        if (company.status === "inactive") {
            throw new AppError(
                "Company is already inactive.",
                400
            );
        }

        const deactivatedCompany =
            await companyRepository.updateStatus(
                id,
                "inactive",
                client
            );

        await auditLogService.createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                companyId: deactivatedCompany.id,
                action: "DEACTIVATE_COMPANY",
                targetId: deactivatedCompany.id,
                description:
                    `Deactivated company ${deactivatedCompany.company_name}`
            }),
            client
        );

        await client.query("COMMIT");

        return deactivatedCompany;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;

    } finally {
        client.release();
    }
};

const deleteCompany = async ({
    id,
    actor,
    requestMeta
}) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const company =
            await companyRepository.findById(id, client);

        if (!company) {
            throw new AppError(
                "Company not found.",
                404
            );
        }

        const [totalUsers, totalLeaveRequests] = await Promise.all([
            companyRepository.countUsersByCompanyId(
                id,
                client
            ),

            companyRepository.countLeaveRequestsByCompanyId(
                id,
                client
            )
        ]);

        if (totalUsers > 0) {
            throw new AppError(
                "Cannot delete company with existing users.",
                400
            );
        }

        if (totalLeaveRequests > 0) {
            throw new AppError(
                "Cannot delete company with existing leave requests.",
                400
            );
        }

        const deletedCompany =
            await companyRepository.deleteCompany(
                id,
                client
            );

        await auditLogService.createAuditLog(
            buildAuditData({
                actor,
                requestMeta,
                companyId: null,
                action: "DELETE_COMPANY",
                targetId: deletedCompany.id,
                description:
                    `Deleted company ${deletedCompany.company_name} (ID: ${deletedCompany.id})`
            }),
            client
        );

        await client.query("COMMIT");

        return deletedCompany;

    } catch (err) {
        await client.query("ROLLBACK");
        throw err;

    } finally {
        client.release();
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