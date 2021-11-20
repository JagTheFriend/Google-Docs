import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { v4 as uuid4 } from "uuid";
import TextEditor from "./Components/TextEditor";
import "./style.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/document/:id" element={<TextEditor />} />
                <Route path="/" element={<Navigate to={`/document/${uuid4()}`} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
