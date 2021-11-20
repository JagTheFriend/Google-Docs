import { Server, Socket } from "socket.io";

const io: Server = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});

io.on("connection", (socket: Socket) => {
    socket.on("get-document", (documentId: string) => {
        const data = "";
        socket.join(documentId);
        socket.emit("load-document", data);
        socket.on("send-changes", (delta) => {
            // send the changes to a specific room/document
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });
    });
});
