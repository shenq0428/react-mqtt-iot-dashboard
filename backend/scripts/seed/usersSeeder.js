const bcrypt = require("bcrypt");
const pool = require("../../config/db");

const companyRoles = require("../data/companyRoles");
const employees = require("../data/employees");

const DEFAULT_PASSWORD = "123";

async function seedUsers(companyMap) {

    console.log("\n🌱 Seeding Users...");

    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

    //--------------------------------------------------------
    // Global Super Admin
    //--------------------------------------------------------

    const superAdmin = await pool.query(
        `
        SELECT id
        FROM users
        WHERE username = $1
        `,
        ["superadmin"]
    );

    if (superAdmin.rows.length === 0) {

        await pool.query(
            `
            INSERT INTO users
            (
                company_id,
                username,
                email,
                password_hash,
                role,
                status,
                privilege_type,
                is_active
            )
            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,$8
            )
            `,
            [
                null,
                "superadmin",
                "superadmin@novalobster.app",
                passwordHash,
                "superadmin",
                "active",
                "permanent",
                true
            ]
        );

        console.log("✅ superadmin created");

    } else {

        console.log("⏩ superadmin already exists");

    }

    //--------------------------------------------------------
    // Company Users
    //--------------------------------------------------------

    let employeeIndex = 0;

    for (const shortName in companyMap) {

        const companyId = companyMap[shortName];

        for (const roleInfo of companyRoles) {

            const employee = employees[employeeIndex];

            employeeIndex++;

            const username =
                `${shortName}_${employee.firstName.toLowerCase()}${employee.lastName.toLowerCase()}`;

            const email =
                `${employee.firstName.toLowerCase()}.${employee.lastName.toLowerCase()}@${shortName}.com`;

            const phoneNumber =
                `01${Math.floor(Math.random() * 90 + 10)}${Math.floor(Math.random() * 1000000)
                    .toString()
                    .padStart(6, "0")}`;

            const existing = await pool.query(
                `
                SELECT id
                FROM users
                WHERE username = $1
                `,
                [username]
            );

            if (existing.rows.length > 0) {

                console.log(`⏩ ${username} already exists`);

                continue;

            }

            await pool.query(
                `
                INSERT INTO users
                (
                    company_id,
                    username,
                    email,
                    password_hash,
                    role,
                    phone_number,
                    status,
                    privilege_type,
                    is_active
                )
                VALUES
                (
                    $1,$2,$3,$4,$5,$6,$7,$8,$9
                )
                `,
                [
                    companyId,
                    username,
                    email,
                    passwordHash,
                    roleInfo.role,
                    phoneNumber,
                    "active",
                    "permanent",
                    true
                ]
            );

            console.log(
                `✅ ${username} (${roleInfo.role}) created`
            );

        }

    }

    console.log("\n🎉 Users Seeder Completed!\n");

}

module.exports = seedUsers;