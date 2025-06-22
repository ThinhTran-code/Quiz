import { useRef, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import newBackground from "../assets/formquiz.jpg";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";

const QuizAIForm = () => {
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const questionsPerPage = 5;

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        setError("");
        setQuestions([]);
        setCurrentPage(1);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", "Các Câu Hỏi Do AI Tạo Ra");
        formData.append("name", "Ôn tập từ tài liệu PDF");
        formData.append("instructions", "Chọn 1 đáp án đúng nhất.");

        try {
            const res = await axios.post(
                "upload",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const rawQuestions = res.data.questions;

            if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
                setError("Không có câu hỏi nào được trả về.");
                setLoading(false);
                return;
            }

            const parsedQuestions = rawQuestions.map((q, idx) => ({
                id: idx + 1,
                text: q.question || "Không có nội dung câu hỏi",
                options: q.answers?.map((a) => a.option) || [],
                correctIndex: q.answer ?? null,
            }));

            setQuestions(parsedQuestions);
        } catch (err) {
            setError("Không thể sinh câu hỏi từ file PDF.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(
        indexOfFirstQuestion,
        indexOfLastQuestion
    );
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    return (
        <div>
            <Navbar />
            <div
                className="min-h-screen bg-no-repeat bg-cover flex flex-col items-center text-[#660000] px-4 pt-10"
                style={{
                    backgroundImage: `url(${newBackground})`,
                    backgroundColor: "#001f1f",
                }}
            >
                <h1 className="text-5xl md:text-6xl font-bold mb-2">
                    A.I. Quiz Generator
                </h1>
                <p className="text-lg md:text-xl font-semibold mb-6 text-center">
                    Tải lên file PDF để AI sinh tự động các câu hỏi trắc nghiệm
                </p>

                <button
                    onClick={handleUploadClick}
                    className="bg-red-300 text-[#660000] font-bold px-8 py-3 rounded-full text-lg flex items-center gap-2 shadow-lg hover:bg-red-200 transition mb-6"
                >
                    <FaFilePdf />
                    Tải lên PDF
                </button>

                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {loading && (
                    <p className="text-lg font-semibold text-yellow-300">
                        Đang tạo câu hỏi từ AI...
                    </p>
                )}
                {error && (
                    <p className="text-red-600 font-semibold mt-4">{error}</p>
                )}

                {questions.length > 0 && (
                    <div className="bg-white bg-opacity-90 rounded-xl shadow-xl p-8 mt-8 max-w-4xl w-full">
                        <h2 className="text-3xl font-bold mb-6 text-center text-[#660000]">
                            Câu hỏi được tạo
                        </h2>
                        <div className="space-y-6">
                            {currentQuestions.map((q) => (
                                <div
                                    key={q.id}
                                    className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-300"
                                >
                                    <p className="text-xl font-semibold text-[#222] mb-4">
                                        {q.id}. {q.text}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-lg text-lg font-medium 
                                        ${i === q.correctIndex
                                                        ? "bg-green-500 text-green font-bold"
                                                        : "bg-white text-gray-800 border border-gray-300"
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + i)}.{" "}
                                                {opt}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center gap-4 mt-6">
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-red-300 text-[#660000] rounded hover:bg-red-200 disabled:opacity-50"
                            >
                                Trang trước
                            </button>
                            <span className="text-lg font-semibold text-[#660000]">
                                Trang {currentPage}/{totalPages}
                            </span>
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-red-300 text-[#660000] rounded hover:bg-red-200 disabled:opacity-50"
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default QuizAIForm;
