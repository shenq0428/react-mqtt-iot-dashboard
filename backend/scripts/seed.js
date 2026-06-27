const seedCompanies = require("./seed/companiesSeeder");
const seedUsers = require("./seed/usersSeeder");
const seedLeaveRequests = require("./seed/leaveRequestsSeeder");
const seedAuditLogs = require("./seed/auditLogsSeeder");

async function seed() {

    console.log("\n========================================");
    console.log(" NovaLobster Database Seeder");
    console.log("========================================");

    try {

        // 1. Companies
        const companyMap = await seedCompanies();

        // 2. Users
        await seedUsers(companyMap);

        // 3. Leave Requests
        await seedLeaveRequests();

        // 4. Audit Logs
        await seedAuditLogs();

        console.log("\n========================================");
        console.log(" 🎉 Database Seed Completed Successfully!");
        console.log("========================================\n");

    } catch (err) {

        console.error(err);
        process.exit(1);

    }

}

seed();