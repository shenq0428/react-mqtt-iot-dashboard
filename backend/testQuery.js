const getTelemetryHistory = require("./influxdb/influxQuery");

async function test() {

  const data = await getTelemetryHistory();

  console.log(data);
}

test();