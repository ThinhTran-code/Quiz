import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css"; // Đảm bảo Tailwind được import vào dự án
import App from "./App";
import "./output.css"; // Dùng file Tailwind đã biên dịch
<script src="https://cdn.tailwindcss.com"></script>;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
