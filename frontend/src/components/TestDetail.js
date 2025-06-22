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
            .get(`test/${quizId}`)
            .then((res) => {
                setQuiz(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi tải quiz:", error);
                setLoading(false);
            });
    }, [quizId]);

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
                    "submit",
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

    useEffect(() => {
        if (loading || !quiz) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true);
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
                className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed px-4 py-12"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>

                {loading ? (
                    <h1 className="relative z-10 text-xl font-semibold text-white">
                        Đang tải quiz...
                    </h1>
                ) : (
                    <div className="relative z-10 w-full max-w-md bg-white p-6 rounded-xl shadow-md mx-auto">
                        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                            {quiz?.name}
                        </h1>

                        <div className="text-center text-blue-600 font-medium text-base mb-6">
                            ⏳ Thời gian còn lại: {formatTime(timeLeft)}
                        </div>

                        {quiz?.questions?.length > 0 ? (
                            <>
                                {quiz.questions.map((q, index) => (
                                    <div
                                        key={q._id}
                                        className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6"
                                    >
                                        <h2 className="text-sm font-medium text-gray-700 mb-3">
                                            {index + 1}. {q.question}
                                        </h2>
                                        <div className="space-y-3">
                                            {q.answers.map((option, i) => (
                                                <label
                                                    key={i}
                                                    className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer transition ${answers[q._id] === i
                                                        ? "bg-blue-50 border-blue-500"
                                                        : "bg-white hover:bg-gray-100"
                                                        }`}
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
                                                        className="form-radio text-blue-600 w-5 h-5 mr-3"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {option.option}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleSubmit(false)}
                                        className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                    >
                                        Nộp Bài
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-base text-gray-600 text-center">
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
