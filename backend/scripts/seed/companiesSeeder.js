const pool = require("../../config/db");

const companies = require("../data/companies");

async function seedCompanies() {

    console.log("\n🌱 Seeding Companies...");

    const companyMap = {};

    for (const company of companies) {

        const existing = await pool.query(
            `
            SELECT id
            FROM companies
            WHERE registration_number = $1
            `,
            [
                company.registration_number
            ]
        );

        let companyId;

        if (existing.rows.length > 0) {

            companyId = existing.rows[0].id;

            console.log(`⏩ ${company.company_name} already exists`);

        } else {

            const result = await pool.query(
                `
                INSERT INTO companies
                (
                    company_name,
                    short_name,
                    company_email,
                    company_phone,
                    company_address,
                    registration_number,
                    industry,
                    status
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8
                )
                RETURNING id
                `,
                [
                    company.company_name,
                    company.short_name,
                    company.company_email,
                    company.company_phone,
                    company.company_address,
                    company.registration_number,
                    company.industry,
                    company.status
                ]
            );

            companyId = result.rows[0].id;

            console.log(`✅ ${company.company_name} created`);

        }

        companyMap[company.short_name] = companyId;

    }

    console.log("\n🎉 Companies Seeder Completed!\n");

    return companyMap;

}

module.exports = seedCompanies;