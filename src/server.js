import express from "express";
import http from "http";
import SocketIO from "socket.io";
// import { instrument } from "@socket.io/admin-ui"; => 사용하면 다른 방식으로 서버 작성해야 함
// import WebSocket from "ws";


const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect('/'));


const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName) => {
        socket.join(roomName);
        socket.to(roomName).emit("welcome");
    })
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
    socket.on("answer", (answer, roomName) => {
        socket.to(roomName).emit("answer", answer);
    })
    socket.on("ice", (ice, roomName) => {
        socket.to(roomName).emit("ice", ice);
    })
})

const handleListen = () => console.log(`Listening on http://localhost:3000`);
httpServer.listen(3000, handleListen);

// function publicRooms() {
//     const { sockets: { adapter: { sids, rooms } } } = wsServer;
//     const publicRooms = [];
//     rooms.forEach((_, key) => {
//         if (sids.get(key) === undefined) {
//             publicRooms.push(key);
//         }
//     })

//     return publicRooms;
// }

// function countRoom(roomName) {
//     return wsServer.sockets.adapter.rooms.get(roomName)?.size;
// }


// wsServer.on("connection", socket => {
//     socket["nickname"] = "Anon";
//     socket.onAny((event) => {
//         console.log()
//         console.log(`Socket Event: ${event}`);
//     });
//     socket.on("enter_room", (roomName, done) => {
//         socket.join(roomName);
//         done();
//         socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//         wsServer.sockets.emit("room_change", publicRooms());
//     });
//     socket.on("disconnecting", () => {
//         socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
//     })
//     socket.on("disconnect", () => {
//         wsServer.sockets.emit("room_change", publicRooms());
//     })
//     socket.on("new_message", (msg, room, done) => {
//         socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//         done();
//     })
//     socket.on("nickname", (nickname) => {
//         socket["nickname"] = nickname;
//     });
// })


// const wss = new WebSocket.Server({ server });

// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser");
//     socket.on('close', () => console.log('Disconnected from the Browser'));
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg);
//         switch (message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//             case "nickname":
//                 socket["nickname"] = message.payload;
//         }
//     });
// });



