import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/5.jpg"; // 📂 Đảm bảo đường dẫn đúng

const CategoryFlashcards = () => {
    const { categoryName } = useParams(); // 📌 Lấy tên category từ URL
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`http://localhost:9999/api/quizzes/category/${categoryName}`)
            .then((res) => setQuizzes(res.data))
            .catch((error) => console.error("Lỗi tải quiz:", error));
    }, [categoryName]);

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
                style={{ backgroundImage: `url(${backgroundImage})` }} // ✅ Đặt ảnh nền
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>{" "}
                {/* 📌 Overlay làm nổi bật nội dung */}
                <h1 className="relative text-3xl font-bold mb-6 text-white">
                    Quiz - {categoryName}
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-center border-2 border-[#660000] w-[16rem] h-[10rem] cursor-pointer transform transition hover:scale-105"
                            onClick={() => navigate(`/flashcard/${quiz._id}`)}
                        >
                            <h2 className="text-xl font-semibold text-[#660000] mb-2">
                                {quiz.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {quiz.instructions}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CategoryFlashcards;
