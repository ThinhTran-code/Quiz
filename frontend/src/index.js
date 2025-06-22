import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css"; // Đảm bảo Tailwind được import vào dự án
import App from "./App";
import axios from "axios";
import "./output.css"; // Dùng file Tailwind đã biên dịch
<script src="https://cdn.tailwindcss.com"></script>;
// axios.defaults.baseURL = "http://localhost:7071/api/";
// axios.defaults.baseURL = "http://localhost:9999/";
axios.defaults.baseURL = "https://quiz-app-pro.azurewebsites.net/api/";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
