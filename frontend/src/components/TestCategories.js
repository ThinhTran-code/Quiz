import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/8.jpg";
// import jsImg from "../assets/javascript.png";
// 🖼 Danh sách ảnh tương ứng với từng category
// const categoryImages = {
//     HTML: "/assets/html.jpg",
//     CSS: "/assets/css.jpg",
//     // JavaScript: jsImg,
//     React: "/assets/react.jpg",
//     TailwindCSS: "/assets/python.jpg",
//     MongoDB: "/assets/java.jpg",
// };

const TestCategories = () => {
    const [categories, setCategories] = useState([]);
    const [quizCount, setQuizCount] = useState({});
    const [quizzes, setQuizzes] = useState([]);
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

                setQuizzes(res.data);
            })
            .catch((error) => console.error("Lỗi tải danh mục:", error));
    }, []);

    // 🏆 Card danh mục có ảnh
    const CategoryCard = ({ category, count }) => (
        <div
            className="group bg-white/90 p-6 rounded-xl shadow-xl w-[20rem] h-[15rem] flex flex-col justify-between hover:scale-105 transition transform duration-300 cursor-pointer"
            onClick={() => navigate(`/tests/${category}`)}
        >
            {/* <img
                src={categoryImages[category] || "/assets/default.jpg"}
                alt={category}
                className="w-full max-h-[6rem] object-contain rounded-md"
            /> */}

            <h2 className="text-2xl font-bold text-[#660000] mt-3 text-center">
                {category}
            </h2>
            <p className="text-gray-600 text-sm text-center">
                📘 {count || 0} quiz trong chủ đề này
            </p>
            <button className="text-white bg-[#660000] px-5 py-2 mt-3 rounded-lg hover:bg-[#4c0000]">
                Bắt đầu →
            </button>
        </div>
    );

    // 🔀 Chọn ngẫu nhiên một quiz từ danh mục bất kỳ
    const handleRandomQuiz = () => {
        if (quizzes.length === 0) return;
        const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
        navigate(`/test/${randomQuiz._id}`);
    };

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

                <h1 className="relative z-10 text-4xl font-bold text-[#660000] mb-10 tracking-wide">
                    Chọn danh mục để làm bài kiểm tra
                </h1>

                <div className="relative z-10 space-y-10">
                    <div className="flex flex-wrap justify-center gap-12">
                        {categories.slice(0, 3).map((cat) => (
                            <CategoryCard
                                key={cat}
                                category={cat}
                                count={quizCount[cat]}
                            />
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-12">
                        {categories.slice(3, 6).map((cat) => (
                            <CategoryCard
                                key={cat}
                                category={cat}
                                count={quizCount[cat]}
                            />
                        ))}
                    </div>
                </div>

                {/* 🔀 Nút chọn quiz ngẫu nhiên */}
                <button
                    onClick={handleRandomQuiz}
                    className="relative z-10 mt-10 bg-[#660000] text-white text-lg px-6 py-3 rounded-lg font-semibold hover:bg-[#500000] shadow-md transition duration-300"
                >
                    🎲 Chọn Random 1 Quiz
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default TestCategories;
