const pool = require("./db");
const eventModel = require("./eventModel");

async function testModel() {
    try {
        const events = await eventModel.getAllEvents();

        console.log("Event Model works!");
        console.log("Events:", events);

    } catch (error) {
        console.error("Model test failed:", error.message);

    } finally {
        await pool.end();
    }
}

testModel();