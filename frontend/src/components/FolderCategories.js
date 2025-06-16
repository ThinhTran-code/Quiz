import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/6.jpg";
import JsImage from "../assets/js1.png";
import HTMLImage from "../assets/html.jpg";
import CSSImage from "../assets/css1.png";
import ReactImage from "../assets/react.png";
import TailwindCSSImage from "../assets/tailwindcss.png";
import MongoDBImage from "../assets/MongoDB-Logo.jpg";
import QuizAI from "../assets/aiquiz.png";
// 🖼 Danh sách ảnh tương ứng với từng category
const categoryImages = {
    HTML: HTMLImage,
    CSS: CSSImage,
    JavaScript: JsImage,
    React: ReactImage,
    TailwindCSS: TailwindCSSImage,
    MongoDB: MongoDBImage,
    "Các Câu Hỏi Do AI Tạo Ra": QuizAI,
};

const FolderCategories = () => {
    const [categories, setCategories] = useState([]);
    const [quizCount, setQuizCount] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("http://localhost:9999/api/quizzes")
            .then((res) => {
                const uniqueCategories = [
                    ...new Set(res.data.map((quiz) => quiz.category)),
                ];
                setCategories(uniqueCategories);

                const countMap = res.data.reduce((acc, quiz) => {
                    acc[quiz.category] = (acc[quiz.category] || 0) + 1;
                    return acc;
                }, {});
                setQuizCount(countMap);
            })
            .catch((error) => console.error("Lỗi tải danh mục:", error));
    }, []);

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                <h1 className="relative text-3xl font-bold mb-6 text-white">
                    Chọn danh mục Quiz
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                    {categories.map((category) => (
                        <div
                            key={category}
                            className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-center border-2 border-[#660000] w-[14rem] h-[12rem] cursor-pointer transform transition hover:scale-105"
                            onClick={() => navigate(`/flashcards/${category}`)}
                        >
                            <img
                                src={
                                    categoryImages[category] ||
                                    "/assets/default.jpg"
                                }
                                alt={category}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <h2 className="text-xl font-semibold text-[#660000] mt-2">
                                {category}
                            </h2>
                            <p className="text-sm text-gray-500">
                                📚 {quizCount[category] || 0} Quiz
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default FolderCategories;
