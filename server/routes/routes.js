//which function to handle which request
const express = require("express");
//create router object
const router = express.Router();

const controller = require("../controllers/controller");

const getEvents = controller.getEvents;
const createEvent = controller.createEvent;
const updateEvent = controller.updateEvent;
const updateInviteeStatus = controller.updateInviteeStatus;
const deleteEvent = controller.deleteEvent;

//get all events
//handle "get" request + inline route + 请求匹配时调用function：getevents
router.get("/", getEvents);

//create an event
router.post("/", createEvent);

//update event done status
router.patch("/:id", updateEvent);

//update invitee status
router.patch("/:id/invitees/:name", updateInviteeStatus);

//delete event
router.delete("/:id", deleteEvent);

module.exports = router;