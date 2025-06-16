import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/4.jpg"; // ✅ Ảnh nền

const FlashcardList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const quizzesPerPage = 5;

    useEffect(() => {
        axios
            .get("http://localhost:9999/api/quizzes")
            .then((response) => setQuizzes(response.data))
            .catch((error) =>
                console.error("Lỗi khi tải danh sách quiz:", error)
            );
    }, []);

    // Lọc theo từ khóa tìm kiếm
    const filteredQuizzes = quizzes.filter((quiz) =>
        quiz.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastQuiz = currentPage * quizzesPerPage;
    const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
    const currentQuizzes = filteredQuizzes.slice(
        indexOfFirstQuiz,
        indexOfLastQuiz
    );

    const nextPage = () => {
        if (indexOfLastQuiz < filteredQuizzes.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToRandomQuiz = () => {
        const random =
            filteredQuizzes[Math.floor(Math.random() * filteredQuizzes.length)];
        if (random) navigate(`/flashcard/${random._id}`);
    };

    return (
        <div className="relative">
            <Navbar />

            {/* Background overlay */}
            <div
                className="min-h-screen w-full bg-cover bg-center bg-fixed p-6 flex flex-col items-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40 z-0" />

                <div className="relative z-10 w-full max-w-5xl text-center">
                    <h1 className="text-3xl font-bold mb-6 text-white">
                        Chọn Một Quiz Để Học
                    </h1>

                    {/* 🔍 Thanh tìm kiếm */}
                    <input
                        type="text"
                        placeholder="Tìm kiếm quiz..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-6 px-4 py-2 rounded-lg w-full max-w-md shadow-md outline-none border border-gray-300"
                    />

                    {/* 📚 Danh sách quiz */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
                        {currentQuizzes.map((quiz) => (
                            <div
                                key={quiz._id}
                                className="bg-white bg-opacity-90 p-4 rounded-lg shadow-lg text-center border-2 border-[#660000] w-[16rem] h-[11rem] cursor-pointer"
                                onClick={() =>
                                    navigate(`/flashcard/${quiz._id}`)
                                }
                            >
                                <h2 className="text-xl font-semibold text-[#660000] mb-2">
                                    {quiz.name}
                                </h2>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {quiz.instructions}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* 📍 Phân trang */}
                    <div className="mt-6 flex gap-4 justify-center">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`px-6 py-2 rounded-lg font-semibold shadow-md ${
                                currentPage === 1
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-white text-[#660000] hover:bg-gray-300"
                            }`}
                        >
                            Quay lại
                        </button>
                        <button
                            onClick={nextPage}
                            disabled={indexOfLastQuiz >= filteredQuizzes.length}
                            className={`px-6 py-2 rounded-lg font-semibold shadow-md ${
                                indexOfLastQuiz >= filteredQuizzes.length
                                    ? "bg-gray-300 text-[#660000] cursor-not-allowed"
                                    : "bg-white text-text-[#660000] hover:bg-gray-300"
                            }`}
                        >
                            Tiếp theo
                        </button>
                    </div>

                    {/* 🎲 Học ngẫu nhiên */}
                    {filteredQuizzes.length > 0 && (
                        <button
                            onClick={goToRandomQuiz}
                            className="mt-8 bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                        >
                            Học ngẫu nhiên
                        </button>
                    )}

                    {/* Nếu không tìm thấy kết quả */}
                    {filteredQuizzes.length === 0 && (
                        <p className="text-white mt-10 italic">
                            Không tìm thấy quiz nào phù hợp.
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FlashcardList;
