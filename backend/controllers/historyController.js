const getTelemetryHistory =
require("../influxdb/influxQuery");

const getHistory = async (req, res) => {

    try {

        const data =
        await getTelemetryHistory();

        res.json(data);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error:
            "Failed to fetch telemetry history"
        });
    }
};

module.exports = {
    getHistory
};