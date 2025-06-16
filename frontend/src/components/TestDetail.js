import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";
import backgroundImage from "../assets/10.jpg";

const TestDetail = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(300);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId") || "user123";

    useEffect(() => {
        axios
            .get(`http://localhost:9999/api/quizzes/${quizId}`)
            .then((res) => {
                setQuiz(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi tải quiz:", error);
                setLoading(false);
            });
    }, [quizId]);

    // ✅ Định nghĩa handleSubmit bằng useCallback
    const handleSubmit = useCallback(
        async (auto = false) => {
            if (!quiz) return;

            const unanswered = quiz.questions.filter(
                (q) => !(q._id in answers)
            );
            if (!auto && unanswered.length > 0) {
                alert(
                    `⚠️ Bạn chưa trả lời ${unanswered.length} câu hỏi. Vui lòng hoàn thành trước khi nộp bài.`
                );
                return;
            }

            const formattedAnswers = quiz.questions.map((q) => ({
                questionId: q._id,
                selectedAnswer: Number(answers[q._id]),
                isCorrect: Number(answers[q._id]) === Number(q.answer),
            }));

            const submission = {
                quizId,
                userId,
                answers: formattedAnswers,
                totalQuestions: quiz.questions.length,
            };

            try {
                const res = await axios.post(
                    "http://localhost:9999/api/quizzes/submit",
                    submission
                );
                const result = res.data.quizAttempt;
                navigate(
                    `/result?score=${result.score}&total=${result.totalQuestions}`
                );
            } catch (error) {
                console.error("Lỗi gửi bài:", error);
                if (!auto) alert("Nộp bài thất bại. Vui lòng thử lại.");
            }
        },
        [answers, quiz, quizId, userId, navigate]
    );

    // ⏳ Countdown timer
    useEffect(() => {
        if (loading || !quiz) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // ✅ Gọi tự động nộp bài khi hết giờ
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, quiz, handleSubmit]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {loading ? (
                    <h1 className="relative z-10 text-2xl font-bold text-white">
                        Đang tải quiz...
                    </h1>
                ) : (
                    <div className="relative z-10 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold mb-4 text-[#660000] text-center">
                            {quiz?.name}
                        </h1>

                        <div className="text-center text-red-600 font-bold text-xl mb-6">
                            ⏳ Thời gian còn lại: {formatTime(timeLeft)}
                        </div>

                        {quiz?.questions?.length > 0 ? (
                            <>
                                {quiz.questions.map((q, index) => (
                                    <div
                                        key={q._id}
                                        className="bg-gray-100 p-5 rounded-lg shadow-md mb-6"
                                    >
                                        <h2 className="text-lg font-semibold text-[#660000] mb-4">
                                            {index + 1}. {q.question}
                                        </h2>
                                        <div className="grid grid-cols-1 gap-3">
                                            {q.answers.map((option, i) => (
                                                <label
                                                    key={i}
                                                    className="flex items-center space-x-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-200"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={q._id}
                                                        value={i}
                                                        checked={
                                                            answers[q._id] === i
                                                        }
                                                        onChange={(e) =>
                                                            setAnswers({
                                                                ...answers,
                                                                [q._id]: Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            })
                                                        }
                                                        className="w-5 h-5"
                                                    />
                                                    <span className="text-[#660000] text-lg">
                                                        {option.option}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-center">
                                    <button
                                        onClick={() => handleSubmit(false)}
                                        className="mt-6 bg-[#660000] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[#500000] shadow-lg"
                                    >
                                        ✅ Nộp bài
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-lg text-[#660000] text-center">
                                Không có câu hỏi nào trong quiz này.
                            </p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default TestDetail;
