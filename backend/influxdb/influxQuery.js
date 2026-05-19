require("dotenv").config();

const { InfluxDB } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });

const queryApi = client.getQueryApi(org);

async function getTelemetryHistory() {

  const fluxQuery = `
    from(bucket: "${bucket}")
      |> range(start: -1h)
  `;

  const results = [];
  return new Promise((resolve, reject) => {

    queryApi.queryRows(fluxQuery, {
      next(row, tableMeta) {
        const data = tableMeta.toObject(row);
        results.push(data);
      },
      error(error) {
        console.error(error);
        reject(error);
      },
      complete() {
        console.log("Query completed");
        resolve(results);
      },
    });
  });
}

module.exports = getTelemetryHistory;