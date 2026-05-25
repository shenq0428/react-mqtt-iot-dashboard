require("dotenv").config();

const { InfluxDB } = require("@influxdata/influxdb-client");

const influxDB = new InfluxDB({
  url: process.env.INFLUX_URL,
  token: process.env.INFLUX_TOKEN,
});

const queryApi = influxDB.getQueryApi(process.env.INFLUX_ORG);

console.log("Trying to query InfluxDB...");

const query = `
from(bucket: "${process.env.INFLUX_BUCKET}")
  |> range(start: -1h)
  |> limit(n:1)
`;

async function testConnection() {
  try {
    const rows = [];

    await queryApi.collectRows(query).then((data) => {
      rows.push(...data);
    });
    
    console.log(process.env.INFLUX_URL);
    console.log("Connected successfully!");
    console.log("Query result:", rows);
  } catch (err) {
    console.error("Connection failed:");
    console.error(err);
  }
}

testConnection();