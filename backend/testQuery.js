/*const getTelemetryHistory = require("./influxdb/influxQuery");

async function test() {

  const data = await getTelemetryHistory();

  console.log(data);
}

test();*/

const pool = require("./config/db");

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected!");
    console.log(result.rows);
  } catch (err) {
    console.error(err.message);
  }
}

testDB();