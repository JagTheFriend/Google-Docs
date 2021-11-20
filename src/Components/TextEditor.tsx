import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import Delta from "quill-delta";
import { io } from "socket.io-client";
import "quill/dist/quill.snow.css";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function TextEditor() {
    const [socket, setSocket] = useState(null as unknown as typeof io);
    const [quill, setQuill] = useState(null as unknown as Quill);

    const wrapperRef = useCallback((wrapper) => {
        if (wrapper == null) return;
        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);

        // setup the quill editor window
        setQuill(
            new Quill(editor, {
                theme: "snow",
                modules: { toolbar: TOOLBAR_OPTIONS },
            })
        );
    }, []);

    useEffect(() => {
        // connect to the server
        const s = io("http://localhost:3001");
        setSocket(s);
        return () => {
            s.disconnect();
        };
    }, []);

    // Sends the changes to the server
    useEffect(() => {
        // make sure that socket and quill is defined
        if (socket == null || quill == null) return;
        const handler = (delta: Delta, oldDelta: Delta, source: String) => {
            if (source !== "user") return;
            socket.emit("send-changes", delta);
        };
        quill.on("text-change", handler);
        return () => {
            quill.off("text-change", handler);
        };
    }, [socket, quill]);

    // Receives the changes from the sever
    useEffect(() => {
        // make sure that socket and quill is defined
        if (socket == null || quill == null) return;
        const handler = (changes: Delta) => quill.updateContents(changes);
        socket.on("receive-changes", handler);
        return () => {
            socket.off("receive-changes", handler);
        };
    }, [socket, quill]);
    return <div className="container" ref={wrapperRef}></div>;
}
