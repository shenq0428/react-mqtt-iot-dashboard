const { Pool } = require("pg");
require("dotenv").config()

/*local pgadmin postgres
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_NAME,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
*/
//neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false,
    },

    
});

pool.connect()
    .then(() => {
        console.log(
            "✅ Connected to Neon PostgreSQL"
        );
    })
    .catch((err) => {
        console.error(
            "❌ Neon Connection Failed",
            err
        );
    });
    

module.exports = pool;
