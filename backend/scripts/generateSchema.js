const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const requiredVariables = [
    "PG_USER",
    "PG_HOST",
    "PG_NAME",
    "PG_PASSWORD",
    "PG_PORT"
];

const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
);

if (process.env.NODE_ENV === "production") {

    console.error(
        "❌ Schema generation must run from Local PostgreSQL, not production."
    );

    process.exit(1);

}

if (missingVariables.length > 0) {

    console.error(
        `❌ Missing local database variables: ${missingVariables.join(", ")}`
    );

    process.exit(1);

}

const pgDumpPath =
    process.env.PG_DUMP_PATH || "pg_dump";

const schemaFolder = path.resolve(
    __dirname,
    "../database/schema"
);

const schemaFile = path.join(
    schemaFolder,
    "schema.sql"
);

const temporarySchemaFile = `${schemaFile}.tmp`;

try {

    fs.mkdirSync(
        schemaFolder,
        { recursive: true }
    );

    if (fs.existsSync(temporarySchemaFile)) {

        fs.unlinkSync(temporarySchemaFile);

    }

    console.log("\n======================================");
    console.log(" NovaLobster Schema Snapshot");
    console.log("======================================\n");

    console.log("📦 Exporting Local PostgreSQL schema...");
    
console.log(
    `Target database: ${process.env.PG_USER}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_NAME}`
);

console.log(
    `Output file: ${schemaFile}`
);
    execFileSync(
        pgDumpPath,
        [
            "-h",
            process.env.PG_HOST,

            "-p",
            String(process.env.PG_PORT),

            "-U",
            process.env.PG_USER,

            "-d",
            process.env.PG_NAME,

            "--schema-only",
            "--no-owner",
            "--no-privileges",

            "--file",
            temporarySchemaFile
        ],
        {
            stdio: "inherit",

            env: {
                ...process.env,
                PGPASSWORD: process.env.PG_PASSWORD
            }
        }
        
    );

    if (fs.existsSync(schemaFile)) {

        fs.unlinkSync(schemaFile);

    }

    fs.renameSync(
        temporarySchemaFile,
        schemaFile
    );

    console.log("\n✅ schema.sql updated successfully.");

} catch (err) {

    if (fs.existsSync(temporarySchemaFile)) {

        fs.unlinkSync(temporarySchemaFile);

    }

    console.error("\n❌ Failed to generate schema snapshot.");
    console.error(err.message);

    process.exit(1);

}