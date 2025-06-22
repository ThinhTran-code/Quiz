import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import backgroundImage from "../assets/5.jpg";

const CategoryFlashcards = () => {
    const { categoryName } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`quizzes/category/${categoryName}`)
            .then((res) => setQuizzes(res.data))
            .catch((error) => console.error("Lỗi tải quiz:", error));
    }, [categoryName]);

    // 🔍 Lọc flashcards theo từ khóa tìm kiếm
    const filteredQuizzes = quizzes.filter(
        (quiz) =>
            quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quiz.instructions.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-start bg-cover bg-center bg-fixed py-16 px-4"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

                <h1 className="relative z-10 text-4xl font-bold text-white mb-10 text-center">
                    📘 Danh sách Flashcards - {categoryName}
                </h1>

                {/* 🔍 Ô nhập tìm kiếm */}
                <div className="relative z-10 mb-6">
                    <input
                        type="text"
                        placeholder="🔍 Tìm flashcard..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-4 py-2 border rounded-md w-96 text-lg"
                    />
                </div>

                <div className="relative z-10 w-full flex justify-center">
                    <div className="bg-white/90 p-6 rounded-xl shadow-md max-w-6xl w-full">
                        <div className="overflow-x-auto">
                            <table className="mx-auto min-w-fit text-sm text-left">
                                <thead className="bg-black text-white">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">
                                            📄 Tên Flashcard
                                        </th>
                                        <th className="px-4 py-3">
                                            📘 Miêu tả
                                        </th>
                                        <th className="px-4 py-3">
                                            ❓ Tổng câu hỏi
                                        </th>
                                        <th className="px-4 py-3">
                                            📅 Ngày tạo
                                        </th>
                                        <th className="px-4 py-3">
                                            🎯 Hoạt động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredQuizzes.map((quiz, index) => (
                                        <tr
                                            key={quiz._id}
                                            className="border-t hover:bg-gray-100"
                                        >
                                            <td className="px-4 py-3">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-[#660000]">
                                                {quiz.name}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {quiz.instructions}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                <span className="bg-gray-500 text-black text-xs font-semibold px-2 py-1 rounded">
                                                    {quiz.questionsCount || 0}{" "}
                                                    câu hỏi
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">
                                                {quiz.createdAt &&
                                                    !isNaN(
                                                        Date.parse(quiz.createdAt)
                                                    )
                                                    ? new Date(
                                                        quiz.createdAt
                                                    ).toLocaleDateString(
                                                        "vi-VN"
                                                    )
                                                    : "Chưa xác định"}
                                            </td>
                                            <td className="px-4 py-3 flex flex-col gap-2 sm:flex-row">
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/flashcard/${quiz._id}`
                                                        )
                                                    }
                                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
                                                >
                                                    🚀 Xem Flashcard
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CategoryFlashcards;
