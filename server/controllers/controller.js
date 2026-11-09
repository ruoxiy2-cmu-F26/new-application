/*
let events = [];

//GET/api/events
function getEvents(req, res) {
    res.status(200).json(events);
}*/
const eventModel = require("../models/eventModel");
//GET/api/events
//async function to get all events from the database
async function getEvents(req, res) {
    try {
        const events = await eventModel.getAllEvents();//call the function in eventModel.js to get all events from the database
        //await等待 getAllEvents() 返回的 Promise 完成，然后获取查询结果
        res.status(200).json(events);//send the events(JS object) as a JSON response with a status code of 200 (OK)
    } catch (error) {
        console.error("Error getting events:", error);//to log the error message to the console for debugging purposes
        res.status(500).json({//send a JSON response with a status code of 500 (Internal Server Error) and an error message
            error: "Failed to get events"
        });
    }
}

//POST/api/events
/*
function createEvent(req, res) {
    const title = req.body.title;
    const date = req.body.date;
    const time = req.body.time;
    const description = req.body.description;
    const organizer = req.body.organizer;
    const invitees = req.body.invitees;
    if (!title || !date || !time || !organizer) {
        return res.status(400).json({//bad request
            error: "Missing required fields"
        });
    }
    //create new event
    const newEvent = {
        id: Date.now(),
        title,
        date,
        time,
        description: description || "",
        organizer,
        invitees: Array.isArray(invitees) ? invitees : [],
        done: false
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
}*/
async function createEvent(req, res) {
    const title = req.body.title;
    const date = req.body.date;
    const time = req.body.time;
    const description = req.body.description;
    const organizer = req.body.organizer;
    const invitees = req.body.invitees;

    if (!title || !date || !time || !organizer || !Array.isArray(invitees) || invitees.length === 0) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    const eventData = {//create a new event object with the provided data
        title,
        date,
        time,
        description: description || "",
        organizer,
        invitees: Array.isArray(invitees) ? invitees : []
    };

    try {
        const newEvent = await eventModel.createEvent(eventData);//call the function in eventModel.js to create a new event in the database
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({
            error: "Failed to create event"
        });
    }
}

//PATCH/api/events/:id
/*
function updateEvent(req, res) {
    const eventId = Number(req.params.id);//convert string into number
    const eventData = events.find(function (event) {
        return event.id === eventId;
    });
    if (!eventData) {
        return res.status(404).json({
            error: "Event not found"
        });
    }
    const done = req.body.done;
    if (typeof done !== "boolean") {//the type of “done”
        return res.status(400).json({
            error: "done must be a boolean"
        });
    }
    eventData.done = done;
    res.status(200).json(eventData);
}*/
// PATCH /api/events/:id
async function updateEvent(req, res) {
    const eventId = Number(req.params.id);///convert string into number
    const done = req.body.done;

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
        return res.status(400).json({
            error: "Invalid event ID"
        });
    }

    if (typeof done !== "boolean") {
        return res.status(400).json({
            error: "done must be a boolean"
        });
    }

    try {
        const event = await eventModel.updateEvent(eventId, done);
        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({
            error: "Failed to update event"
        });
    }
}

//PATCH/api/events/:id/invitees/:name
/*
function updateInviteeStatus(req, res) {
    const eventId = Number(req.params.id);
    const inviteeName = req.params.name;
    const eventData = events.find(function (event) {
        return event.id === eventId;
    });
    if (!eventData) {
        return res.status(404).json({
            error: "Event not found"
        });
    }
    const person = eventData.invitees.find(function (invitee) {
        return invitee.name === inviteeName;
    });
    if (!person) {
        return res.status(404).json({
            error: "Invitee not found"
        });
    }
    const status = req.body?.status;
    if (status !== "accepted" && status !== "declined") {
        return res.status(400).json({
            error: "Invalid status"
        });
    }
    person.status = status;
    res.status(200).json(eventData);
}*/
// PATCH /api/events/:id/invitees/:name
async function updateInviteeStatus(req, res) {
    const eventId = Number(req.params.id);
    const inviteeName = req.params.name;
    const status = req.body.status;

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
        return res.status(400).json({
            error: "Invalid event ID"
        });
    }

    if (status !== "accepted" && status !== "declined") {
        return res.status(400).json({
            error: "Invalid status"
        });
    }

    try {
        const event = await eventModel.updateInviteeStatus(
            eventId,
            inviteeName,
            status
        );
        if (!event) {
            const existingEvent = await eventModel.getEventById(eventId);
            if (!existingEvent) {
                return res.status(404).json({
                    error: "Event not found"
                });
            }
            return res.status(404).json({
                error: "Invitee not found"
            });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Error updating invitee:", error);
        res.status(500).json({
            error: "Failed to update invitee"
        });
    }
}

//DELETE/api/events/:id
/*
function deleteEvent(req, res) {
    const eventId = Number(req.params.id);
    const originalLength = events.length;
    events = events.filter(function (event) {
        return event.id !== eventId;
    });
    if (events.length === originalLength) {
        return res.status(404).json({
            error: "Event not found"
        });
    }
    res.status(204).send();
}*/
// DELETE /api/events/:id
async function deleteEvent(req, res) {
    const eventId = Number(req.params.id);

    if (!Number.isSafeInteger(eventId) || eventId <= 0) {
        return res.status(400).json({
            error: "Invalid event ID"
        });
    }

    try {
        const deleted = await eventModel.deleteEvent(eventId);
        if (!deleted) {
            return res.status(404).json({
                error: "Event not found"
            });
        }
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({
            error: "Failed to delete event"
        });
    }
}

//export all the function in controller
module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    updateInviteeStatus,
    deleteEvent
};