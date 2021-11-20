import { Server, Socket } from "socket.io";
import { connect } from "mongoose";
import Document from "./Document";

// connect to database
connect("mongodb://localhost:27017/google-docs");
const defaultValue = "";

const io: Server = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        method: ["GET", "POST"],
    },
});
io.on("connection", (socket: Socket) => {
    socket.on("get-document", async (documentId: string) => {
        const document = await findOrCreateDocument(documentId);

        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta) => {
            // send the changes to a specific room/document
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data: string) => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
});

async function findOrCreateDocument(id: string) {
    if (id === null) return;
    const document = await Document.findById(id);
    if (document) return document;
    // Create the document if it is not found
    return await Document.create({ _id: id, data: defaultValue });
}
