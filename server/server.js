/*
//导入express
const express = require("express");

const cors=require("cors");

//创建express application，这个app就是服务器应用对象
const app = express();

const PORT = 3000;


app.use(cors());
//设置middleware

app.use(express.json());

//events是服务器用来存储数据的数组
let events=[];
app.get("/api/events", function(req,res){
    res.status(200).json(events);
})

//创建event
app.post("/api/events", function (req, res) {
    const { title, date, time, description, organizer, invitees } = req.body;

    if (!title || !date || !time || !organizer) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

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
});

//修改events
app.patch("/api/events/:id", function (req, res) {
    const eventId = Number(req.params.id);

    const eventData = events.find(function (event) {
        return event.id === eventId;
    });

    if (!eventData) {
        return res.status(404).json({
            error: "Event not found"
        });
    }

    const { done } = req.body;

    if (typeof done !== "boolean") {
        return res.status(400).json({
            error: "done must be a boolean"
        });
    }

    eventData.done = done;

    res.status(200).json(eventData);
});

// 修改被邀请人的状态：accepted / declined
app.patch("/api/events/:id/invitees/:name", function(req, res) {

    // 1. Get event ID and invitee name from URL
    const eventId = Number(req.params.id);
    const inviteeName = req.params.name;

    // 2. Find the event
    const eventData = events.find(function(event) {
        return event.id === eventId;
    });

    if (!eventData) {
        return res.status(404).json({
            error: "Event not found"
        });
    }

    // 3. Find the invitee
    const person = eventData.invitees.find(function(invitee) {
        return invitee.name === inviteeName;
    });

    if (!person) {
        return res.status(404).json({
            error: "Invitee not found"
        });
    }

    // 4. Get and validate status from request body
    const status = req.body?.status;

    if (status !== "accepted" && status !== "declined") {
        return res.status(400).json({
            error: "Invalid status"
        });
    }

    // 5. Update invitee status
    person.status = status;

    // 6. Return updated event
    res.status(200).json(eventData);
});

//删除events
app.delete("/api/events/:id", function (req, res) {
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
});

//api routes，读取events
app.get("/", function (req, res) {
    res.send("Event Planner Server is running!");
});

//启动服务器
app.listen(PORT, function () {
    console.log(`Server running at http://localhost:${PORT}`);
});
*/


//create webserver,
const express = require("express");
//cross-origin resource sharing
const cors = require("cors");
const path = require("path");
//import routes,middleware
const eventRoutes = require("./routes/routes");
const loggerMiddleware = require("./middleware/middleware");

//add
const http = require("node:http");
const { Server } = require("socket.io");

//create express application
const app = express();
const PORT = 3000;

//add
// 创建供 Express 和 Socket.IO 共用的服务器
const server = http.createServer(app);
const io = new Server(server);

// controller 可以通过 req.app.get("io") 获取它
app.set("io", io);

// 每次浏览器建立连接时执行
io.on("connection", (socket) => {
    const username = socket.handshake.auth.username;

    if (typeof username !== "string" || !username.trim()) {
        socket.disconnect();
        return;
    }

    // 例如 Bob 的连接加入 user:Bob
    socket.join(`user:${username.trim()}`);
});

//middleware
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

//serve static frontend assets
//绝对路径
app.use("/scripts", express.static(path.join(__dirname, "../client/scripts")));
app.use("/css", express.static(path.join(__dirname, "../client/css")));
app.use("/img", express.static(path.join(__dirname, "../client/img")));

// Serve page files
app.get("/login.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../client/pages/login.html"));
});
app.get("/Organizerview.html", function(req, res) {
    res.sendFile(path.join(__dirname, "../client/pages/Organizerview.html"));
});


// Routes
app.use("/api/events", eventRoutes);

//to the login page directly
app.get("/", function(req, res) {
    res.redirect("/login.html");
});

// Start server
//把app.listen(PORT)改成server.listen(PORT)，因为我们要让Socket.IO和Express共用同一个服务器
server.on("error", function(error) {
    if (error.code !== "EADDRINUSE") {
        console.error("Failed to start server:", error.message);
        process.exitCode = 1;
        return;
    }

    const request = http.get({
        hostname: "127.0.0.1",
        port: PORT,
        path: "/login.html"
    }, function(response) {
        response.resume();
        if (response.statusCode === 200) {
            console.log(`Server is already running at http://localhost:${PORT}`);
            return;
        }

        console.error(`Port ${PORT} is already in use by another application.`);
        process.exitCode = 1;
    });

    request.on("error", function() {
        console.error(`Port ${PORT} is already in use by another application.`);
        process.exitCode = 1;
    });
});

server.listen(PORT, function() {
    console.log(`Server running at http://localhost:${PORT}`);
});
