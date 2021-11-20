import { Socket } from "socket.io";

const io: Socket = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("Connected!");
});
