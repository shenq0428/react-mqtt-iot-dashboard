const { Pool } = require("pg");
require("dotenv").config();

let pool;

if (process.env.NODE_ENV === "production") {

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    console.log("✅ Connected to Neon PostgreSQL");

} else {

    pool = new Pool({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_NAME,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT,
    });

    console.log("✅ Connected to Local PostgreSQL");
}

module.exports = pool;