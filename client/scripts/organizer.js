
//topbar & signinusername
const currentUser = localStorage.getItem("currentUser");
document.querySelector(".topbar-right-signin").innerHTML = `
    Signed in as ${currentUser}
`;

//all events
let events = JSON.parse(localStorage.getItem("events")) || [];


//left side: New Event Form
const eventForm = document.getElementById("newform")

const inputTitle = document.getElementById("input_title");
const inputDate = document.querySelector(".input_date");
const inputTime = document.querySelector(".input_time");
const inputDescription = document.getElementById("input_description");
const inputInvite = document.getElementById("input_invite");

eventForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = inputTitle.value;
    const date = inputDate.value;
    const time = inputTime.value;
    const description = inputDescription.value;
    const invite = inputInvite.value;

    //extract invitees' name
    const invitePeople = invite
        .split(",")
        .map(name => {
            return {
                name: name.trim(),
                status: "pending"
            };
        })
        // 防止用户没有输入 invite people 时产生一个空名字
        .filter(person => person.name !== "");


    const newEventData = {
        id: Date.now(),//唯一性标志
        title: title,
        date: date,
        time: time,
        description: description,
        organizer: currentUser,
        invitees: invitePeople
    };
    events.push(newEventData);
    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );
    renderEvents();
    updateBadge();
    renderNotifications();
    eventForm.reset();
});

//the relationship between event and user
function getEventType(eventData) {
    //organizer 
    if (eventData.organizer === currentUser) {
        return "organized";
    }
    //invitee
    const isInvited = eventData.invitees.some(function (person) {
        return person.name === currentUser;
    });
    if (isInvited) {
        return "invited";
    }
    //no relationship
    return null;
}


//right side: Upcoming Event List
const eventList = document.getElementById("eventList");

function renderEvents() {
    eventList.innerHTML = "";

    events.forEach(function (eventData) {
        const eventType = getEventType(eventData);
        if (eventType === null) {
            return;
        }

        //extract month/day/weekday from date
        const date = new Date(eventData.date + "T00:00:00");
        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();
        const weekday = date.toLocaleString("en-US", { weekday: "short" });

    


        let statusHTML = "";
        eventData.invitees.forEach(function (person) {
            statusHTML += `
                <div class="statuschip_event_${person.status}">
                    <label class="dot">&bull;</label>
                    <label class="label_event">${person.name}: ${person.status}</label>
                </div>
            `;
        });

        let organizerText = eventData.organizer;
        if (eventData.organizer === currentUser) {
            organizerText = "you";
        }

        let buttonHTML = "";
        //organizer button
        if (eventType === "organized") {
            let markDoneText = "Mark done";
            if (eventData.done === true) {
                markDoneText = "Done";
            }
            buttonHTML = `
                <div class="button_event">
                    <button class="button_event_markdone" type="button">${markDoneText}</button>
                    <button class="button_event_delete" type="button">Delete</button>
                </div>
            `;
        }
        //invitee button
        /*if (eventType === "invited") {
            buttonHTML = `
                <div class="button_event">
                    <label class="your_answer">Your answer:</label>
                    <button class="button_event_accept" type="button">Accept</button>
                    <button class="button_event_decline" type="button">Decline</button>
                </div>
            `;
        }*/
        if (eventType === "invited") {
            const currentPerson = eventData.invitees.find(function (person) {
                return person.name === currentUser;
            });
            let acceptText = "Accept";
            let declineText = "Decline";
            let acceptClass = "";
            let declineClass = "";

            if (currentPerson.status === "accepted") {
                acceptText = "Accepted";
                acceptClass = "button_selected";
            }
            if (currentPerson.status === "declined") {
                declineText = "Declined";
                declineClass = "button_selected";
            }
            buttonHTML = `
                <div class="button_event">
                    <label class="your_answer">Your answer:</label>
                    <button class="button_event_accept ${acceptClass}" type="button">${acceptText}</button>
                    <button class="button_event_decline ${declineClass}" type="button">${declineText}</button>
                </div>
            `;
        }

        const newEvent = document.createElement("article");
        newEvent.classList.add("event");
        newEvent.dataset.type = eventType;
        newEvent.innerHTML = `
                    <div class="datebox_event">
                        <div class="month_event">${month}</div>
                        <div class="day_event">
                            <div class="daynumber_event">${day}</div>
                            <div class="weekday_event">${weekday}</div>
                        </div>
                    </div>

                    <div class="details_event">
                        <label class="title_event">${eventData.title}</label>
                        <label class="time_event">${eventData.time}, organized by ${organizerText}</label>
                        <label class="description_event">${eventData.description}</label>
                        <div class="statuschip_event">${statusHTML}</div>
                        ${buttonHTML}
                    </div>
        `;

        //invitee's button (accept or decline)
        if (eventType === "invited") {
            const acceptButton = newEvent.querySelector(".button_event_accept");
            const declineButton = newEvent.querySelector(".button_event_decline");
            //if click the"Accept"->status change(green)
            acceptButton.addEventListener("click", function () {
                const currentPerson = eventData.invitees.find(function (person) {
                    return person.name === currentUser;
                });
                currentPerson.status = "accepted";
                localStorage.setItem(
                    "events",
                    JSON.stringify(events)
                );
                renderEvents();
            });
            //if click the"Decline"->status change(red)
            declineButton.addEventListener("click", function () {
                const currentPerson = eventData.invitees.find(function (person) {
                    return person.name === currentUser;
                });
                currentPerson.status = "declined";
                localStorage.setItem(
                    "events",
                    JSON.stringify(events)
                );
                renderEvents();
            });
        }

        //organizer's button (markdone & delete)
        if (eventType === "organized") {
            const markDoneButton = newEvent.querySelector(".button_event_markdone");
            const deleteButton = newEvent.querySelector(".button_event_delete");
            //click markdone->"done"
            markDoneButton.addEventListener("click", function () {
                eventData.done = true;
                localStorage.setItem(
                    "events",
                    JSON.stringify(events)
                );
                renderEvents();
            });

            //click delete->the whole event display on the list
            deleteButton.addEventListener("click", function () {
                events = events.filter(function (event) {
                    return event.id !== eventData.id;
                });
                localStorage.setItem(
                    "events",
                    JSON.stringify(events)
                );
                renderEvents();
            });
        }
        eventList.appendChild(newEvent);
    });
}

//filters
const filterAll = document.querySelector(".filter_all");
const filterInvited = document.querySelector(".filter_invited");
const filterOrganized = document.querySelector(".filter_organized");

//filterAll
filterAll.addEventListener("click", function () {
    const events = document.querySelectorAll(".event");
    events.forEach(function (event) {
        event.style.display = "";
    });
    setActiveFilter(filterAll);
});

//filterOrganized
filterOrganized.addEventListener("click", function () {
    const events = document.querySelectorAll(".event");
    events.forEach(function (event) {
        if (event.dataset.type === "organized") {
            event.style.display = "";
        } else {
            event.style.display = "none";
        }
    });
    setActiveFilter(filterOrganized);
});

//filterInvited
filterInvited.addEventListener("click", function () {
    const events = document.querySelectorAll(".event");
    events.forEach(function (event) {
        if (event.dataset.type === "invited") {
            event.style.display = "";
        } else {
            event.style.display = "none";
        }
    });
    setActiveFilter(filterInvited);
});

//when the filter is active: color white
function setActiveFilter(button) {
    filterAll.classList.remove("filter_active");
    filterInvited.classList.remove("filter_active");
    filterOrganized.classList.remove("filter_active");
    button.classList.add("filter_active");
}

//notificationpanel
const bell = document.querySelector(".bell-icon");
const notificationPanel = document.querySelector(".notificationpanel");

bell.addEventListener("click", function () {
    notificationPanel.classList.toggle("show");
});

//number on the badge(bellicon)
const badgeCount = document.querySelector(".badge-count");
const notificationList = document.getElementById("notificationList");

function getInvitedEvents() {
    return events.filter(function (eventData) {
        return eventData.invitees.some(function (person) {
            return person.name === currentUser;
        });
    });
}

function updateBadge() {
    const invitedEvents = getInvitedEvents();
    badgeCount.textContent = invitedEvents.length;
}

function renderNotifications() {
    const invitedEvents = getInvitedEvents();
    notificationList.innerHTML = "";
    invitedEvents.forEach(function (eventData) {
        const notification = document.createElement("div");
        notification.classList.add("notificationpanel-content");
        notification.innerHTML = `
            <div>${eventData.organizer} invited you to"${eventData.title}"</div>
        `;
        notificationList.appendChild(notification);
    });
}


//show the event
renderEvents();

updateBadge();

//show notifications
renderNotifications();