import { Server, Socket } from "socket.io";

const io: Server = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});

io.on("connection", (socket: Socket) => {
    console.log("Connected!");
    socket.on("send-changes", (delta) => {
        console.log(delta);
    });
});
