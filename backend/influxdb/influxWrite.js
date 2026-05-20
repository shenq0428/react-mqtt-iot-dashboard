require("dotenv").config();

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });

const writeApi = client.getWriteApi(org, bucket);
let writtenId = 0;
function writeTelemetry(parsedData) {
    const siteId = parsedData.id;
    
    // LOOP BLOWERS
    Object.entries(parsedData.blower).forEach(
        ([equipmentName, equipmentData]) => {
            const point = new Point("telemetry")
                .tag("site", siteId)
                .tag("equipment", equipmentName.replace(" ", "_"))
                .tag("type", "blower")
                .floatField("power", equipmentData.power)
                .floatField("motor_amp", equipmentData["motor-amp"])
                .floatField("energy_consumption", equipmentData.energy_consumption)
                .intField("run_status", equipmentData.run_status);

            writeApi.writePoint(point);
        }
    );

    // LOOP PUMPS
    Object.entries(parsedData.pump).forEach(
        ([equipmentName, equipmentData]) => {
            const point = new Point("telemetry")
                .tag("site", siteId)
                .tag("equipment", equipmentName.replace(" ", "_"))
                .tag("type", "pump")
                .floatField("power", equipmentData.power)
                .floatField("motor_amp", equipmentData["motor-amp"])
                .floatField("energy_consumption", equipmentData.energy_consumption)
                .intField("run_status", equipmentData.run_status);

            writeApi.writePoint(point);
        }
    );
    writeApi.flush();
    writtenId++;
    console.log(`Telemetry written ${writtenId}to InfluxDB`);
}

module.exports = writeTelemetry;