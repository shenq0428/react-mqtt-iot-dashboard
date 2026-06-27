const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

async function migrate() {

    console.log("\n======================================");
    console.log(" NovaLobster Database Migration");
    console.log("======================================\n");

    try {

        // Create migration history table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ schema_migrations ready.\n");

        const migrationsPath = path.join(
            __dirname,
            "../database/migrations"
        );

        const files = fs
            .readdirSync(migrationsPath)
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {

            const exists = await pool.query(
                `
                SELECT id
                FROM schema_migrations
                WHERE filename = $1
                `,
                [file]
            );

            if (exists.rows.length > 0) {

                console.log(`⏩ Skip ${file}`);

                continue;

            }

            console.log(`🚀 Running ${file}`);

            const sql = fs.readFileSync(
                path.join(migrationsPath, file),
                "utf8"
            );

            await pool.query(sql);

            await pool.query(
                `
                INSERT INTO schema_migrations(filename)
                VALUES($1)
                `,
                [file]
            );

            console.log(`✅ ${file} completed.\n`);

        }

        console.log("🎉 Migration Finished!");

    } catch (err) {

        console.error("\n❌ Migration Failed");
        console.error(err);

        process.exit(1);

    } finally {

        await pool.end();

    }

}

migrate();