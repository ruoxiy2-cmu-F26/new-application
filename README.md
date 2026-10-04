# new-application
Study Plan Suggested By Sophia
Sophia’s comment:
In order to prepare for the FSE, I would suggest reviewing the basic knowledge of how to use HTML, CSS, JS. Also, I reviewed Ruoxi’s plan but I think her plan was too complicated. Instead, I suggest she build the task plan manager just like google calendar invites. 
# Application Function:
This application is a task and event planning manager inspired by Google Calendar invitations. 
Users can create events or tasks by entering the title, date, time, description, and invitees. 
Organizers can send invitations to other users, while invitees can view the events they have been invited to. 
The application provides real-time notifications using Socket.IO, so invitees can immediately receive updates when a new event is created or an existing event is changed without refreshing the page. 
It also supports user registration, login, and logout, with different functionality for organizers and invitees. 
In addition, the application uses responsive web design, allowing the page layout to automatically adapt to different browser window and screen sizes, such as desktop, tablet, and mobile devices.

# Tech Stack:
Front-end: HTML + CSS + Javascript + FetchAPI
Back-end: Node.js + Express.js + REST API + Socket.IO + JWT + bcrypt
Database: PostgreSQL
The Event Planner application uses HTML, CSS, and Vanilla JavaScript on the frontend: HTML defines the page structure, CSS controls the layout and styling, and JavaScript handles user interactions, form validation, DOM updates, and event rendering. 
The frontend communicates with the backend through REST APIs using HTTP requests and JSON for data exchange. 
The backend is built with Node.js and Express.js, where Node.js provides the server runtime and Express handles API routes, requests, responses, and application logic. PostgreSQL and SQL are used to store and manage persistent data such as users, events, and invitations. Socket.IO provides real-time communication so invitees can receive notifications when events are created or updated. JWT is used for user authentication and authorization, while bcrypt securely hashes user passwords. 
Postman is used to test REST API endpoints, and Git and GitHub are used for version control and code management.
# Structure Diagram:


# Layout Reference:
See Figma:
https://www.figma.com/design/qLe2k0MpAmauBlrAOwpuKc/Planner-%E2%80%93-Task-Manager-UI?node-id=0-1&t=W8Qi3txdr4Dpr9TF-1

# Weekly Plan:

Week 1: HTML + CSS (only static page)
Review page structure, semantic tags, and forms
Review the box model, and simple styling. 
Build a static page with a “New Event” form(title, date, time, description, people who got invited) and two or three hardcoded events (static website only)
HTML CSS Courses: (from 0:00 to 1:17:30 about 4 lessons)
https://www.youtube.com/watch?v=G3e-cpL7ofc

Week 2: HTML+CSS
Watch the same video: 
https://www.youtube.com/watch?v=G3e-cpL7ofc
Watch the CSS Display Property and div Element (2:25:42–2:46:55), then Flexbox and Nested Flexbox (3:43:58–4:44:36), then CSS Position (4:44:36–5:33:49). Skip everything else in the video for now.
Implement the full planner layout, including the top bar, bell badge, and toast position

Week 3: JavaScript in the browser
Watch this video(lesson 1 - 8) https://www.youtube.com/watch?v=EerdGm-ehJQ
Adding JS on client side such as validating the event title

Week 4: JavaScript in the Browser
Watch the same video (lesson 9-12) 
Build: the front-end-only planner. Submitting the form adds an event, events are stored in an array of objects, and a render() function redraws the list. This version saves nothing yet.

Week 5: Client server and RestAPIS
Should know the concepts: what the server is, HTTP requests and responses, status code, and JSON
Know some basic server side structures
Build a Node + Express server with routes, storing events in an in-memory array for now
Learn how to test them using Postman

Week 6: Database
Should know the concepts: tables, rows, primary keys, and basic SQL (SELECT, INSERT, UPDATE, DELETE).
Replace in memory with the databases

Week 7: Socket.io
Learn why REST alone cannot push updates (the server can only answer requests), WebSockets, and Socket.IO rooms.
Implement to keep REST for changing data, and use socket only to notify people. For example, after the POST route saves an event, the server emits notify to each invitee's room

Week 8: Rebuild the whole application with login-logout
Implement login, register, and logout
Separate by roles: organizers and invitees







