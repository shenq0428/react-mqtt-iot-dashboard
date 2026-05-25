const mqtt = require("mqtt");
require("dotenv").config();

const client = mqtt.connect(process.env.MQTT_URL, {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
});

// RANDOM NUMBER HELPER
function random(min, max) {
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

// ENERGY COUNTER
let energy = {
    blower1: -21648,
    blower2: -21717,
    blower3: -21684,
    pump1: 22339,
    pump2: -21717,
    pump3: -21684,
};

// MACHINE RUNNING STATE
// TRUE = RUNNING
// FALSE = STOPPED
const machineStates = {
    blower1: true,
    blower2: true,
    blower3: true,
    pump1: true,
    pump2: true,
    pump3: true,
};

// SMALL CHANCE TO CHANGE MACHINE STATE
function updateMachineState(machineName) {

    // 2% CHANCE TO TOGGLE
    if (Math.random() < 0.02) {

        machineStates[machineName] =
            !machineStates[machineName];

        console.log(
            `${machineName} changed to`,
            machineStates[machineName]
                ? "RUNNING"
                : "STOPPED"
        );
    }
}

// CREATE DEVICE TELEMETRY
function generateTelemetry(
    machineName,
    ampMin,
    ampMax,
    powerMin,
    powerMax,
    energyKey
) {

    const running = machineStates[machineName];

    // UPDATE ENERGY ONLY WHEN RUNNING
    if (running) {
        energy[energyKey] += random(0.1, 0.5);
    }

    return {
        "motor-amp": running
            ? random(ampMin, ampMax)
            : 0,

        power: running
            ? random(powerMin, powerMax)
            : 0,

        energy_consumption: Number(
            energy[energyKey].toFixed(2)
        ),

        run_status: running ? 1 : 0,
    };
}

// FORMAT DATETIME
function getFormattedDateTime() {

    const now = new Date();

    return (
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        " " +
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0") +
        ":" +
        String(now.getSeconds()).padStart(2, "0")
    );
}

client.on("connect", () => {

    console.log(
        "Connected to NovaLobster MQTT Broker!"
    );

    setInterval(() => {

        // UPDATE MACHINE STATES
        updateMachineState("blower1");
        updateMachineState("blower2");
        updateMachineState("blower3");

        updateMachineState("pump1");
        updateMachineState("pump2");
        updateMachineState("pump3");

        // CREATE PAYLOAD
        const payload = {

            id: "DEMO_IWK_260325",

            dts: getFormattedDateTime(),

            blower: {

                "blower 1": generateTelemetry(
                    "blower1",
                    90,
                    100,
                    12,
                    15,
                    "blower1"
                ),

                "blower 2": generateTelemetry(
                    "blower2",
                    70,
                    90,
                    10,
                    15,
                    "blower2"
                ),

                "blower 3": generateTelemetry(
                    "blower3",
                    75,
                    90,
                    10,
                    14,
                    "blower3"
                ),
            },

            pump: {

                "pump 1": generateTelemetry(
                    "pump1",
                    90,
                    100,
                    12,
                    15,
                    "pump1"
                ),

                "pump 2": generateTelemetry(
                    "pump2",
                    70,
                    90,
                    10,
                    15,
                    "pump2"
                ),

                "pump 3": generateTelemetry(
                    "pump3",
                    75,
                    90,
                    10,
                    14,
                    "pump3"
                ),
            },
        };

        // PUBLISH MQTT
        client.publish(
            "data/DEMO_IWK_260325",
            JSON.stringify(payload)
        );

        console.log(
            "Published:",
            payload.dts
        );

    }, 1000);
});