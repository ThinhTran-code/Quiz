import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getQuizById, getQuizzes, submitQuiz } from "../services/quizService";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const QuizPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const storedUserId = localStorage.getItem("userId");
    const userId = user?.userId || storedUserId;

    // Quiz list state (for /quiz)
    const [quizList, setQuizList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const quizzesPerPage = 6;

    // Quiz taking state (for /quiz/:id)
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);

    // ============================
    // LOAD QUIZ LIST (no ID)
    // ============================
    useEffect(() => {
        if (!id) {
            getQuizzes().then(setQuizList).catch(console.error);
        }
    }, [id]);

    // ============================
    // LOAD QUIZ BY ID
    // ============================
    useEffect(() => {
        if (id) {
            if (!userId) {
                alert("Vui lòng đăng nhập để làm bài!");
                navigate("/login");
                return;
            }
            getQuizById(id)
                .then((data) => {
                    setQuiz(data);
                    setTimeLeft(
                        data.duration.minutes * 60 + data.duration.seconds
                    );
                })
                .catch(console.error);
        }
    }, [id, userId]);

    // ============================
    // COUNTDOWN TIMER
    // ============================
    useEffect(() => {
        if (timeLeft === null || !id) return;
        if (timeLeft <= 0) handleSubmit();

        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m} phút ${s.toString().padStart(2, "0")} giây`;
    };

    const handleSelectAnswer = (questionIndex, optionIndex) => {
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[questionIndex] = optionIndex;
            return newAnswers;
        });
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        const formattedAnswers = quiz.questions.map((q, index) => ({
            questionId: q._id,
            selectedAnswer: Number(answers[index]),
            isCorrect: Number(q.answer) === Number(answers[index]),
        }));

        const quizData = {
            quizId: id,
            userId,
            answers: formattedAnswers,
            totalQuestions: quiz.questions.length,
        };

        try {
            const result = await submitQuiz(quizData);
            if (result.quizAttempt) {
                navigate(
                    `/result?score=${result.quizAttempt.score}&total=${result.quizAttempt.totalQuestions}`
                );
            }
        } catch (err) {
            alert("Nộp bài thất bại: " + err.message);
        }
    };

    // ============================
    // RENDER: QUIZ LIST (/quiz)
    // ============================
    if (!id) {
        const filtered = quizList.filter((q) =>
            q.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const totalPages = Math.ceil(filtered.length / quizzesPerPage);
        const paginated = filtered.slice(
            (currentPage - 1) * quizzesPerPage,
            currentPage * quizzesPerPage
        );

        return (
            <div className="bg-gray-50 min-h-screen">
                <Navbar />
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-[#800000] mb-6 text-center">
                        Danh sách Quiz
                    </h1>

                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm quiz..."
                        className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#800000]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {paginated.map((quiz) => (
                            <div
                                key={quiz._id}
                                className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
                            >
                                <h3 className="text-xl font-semibold text-[#660000] mb-2">
                                    {quiz.name}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    {quiz.description || "Không có mô tả."}
                                </p>
                                <button
                                    onClick={() =>
                                        navigate(`/quiz/${quiz._id}`)
                                    }
                                    className="bg-[#800000] text-white px-4 py-2 rounded-lg hover:bg-[#660000] transition"
                                >
                                    🚀 Làm bài
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center mt-8 space-x-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 rounded-lg font-medium text-white ${
                                    currentPage === i + 1
                                        ? "bg-[#800000]"
                                        : "bg-gray-400 hover:bg-gray-500"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============================
    // RENDER: QUIZ DOING (/quiz/:id)
    // ============================
    if (!quiz) {
        return (
            <div className="text-center mt-20 text-xl font-medium text-gray-600">
                Đang tải bài quiz...
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-3xl mx-auto mt-16 px-4 sm:px-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-[#800000] text-center mb-2">
                        {quiz.name}
                    </h2>
                    <p className="text-gray-600 text-center mb-4 italic">
                        {quiz.instructions}
                    </p>

                    <div className="text-center text-red-600 font-semibold text-lg mb-6">
                        ⏳ {formatTime(timeLeft)} còn lại
                    </div>

                    <div className="space-y-6">
                        {quiz.questions.map((q, index) => (
                            <div
                                key={q._id}
                                className="bg-gray-50 border border-gray-200 p-5 rounded-xl shadow"
                            >
                                <p className="font-medium text-[#660000] mb-3">
                                    {index + 1}. {q.question}
                                </p>
                                <ul className="space-y-2">
                                    {q.answers.map((answer, i) => (
                                        <li key={i}>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={i}
                                                    checked={
                                                        answers[index] === i
                                                    }
                                                    onChange={() =>
                                                        handleSelectAnswer(
                                                            index,
                                                            i
                                                        )
                                                    }
                                                    className="accent-[#800000]"
                                                />
                                                <span className="text-gray-700">
                                                    {answer.option}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <button
                        className="w-full mt-8 bg-[#800000] hover:bg-[#660000] text-white py-3 rounded-lg text-lg font-semibold transition duration-300"
                        onClick={handleSubmit}
                    >
                        ✅ Nộp bài
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default QuizPage;
