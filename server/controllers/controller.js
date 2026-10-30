let events = [];

//GET/api/events
function getEvents(req, res) {
    res.status(200).json(events);
}

//POST/api/events
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
}

//PATCH/api/events/:id
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
}

//PATCH/api/events/:id/invitees/:name
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
}

//DELETE/api/events/:id
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
}

//export all the function in controller
module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    updateInviteeStatus,
    deleteEvent
};