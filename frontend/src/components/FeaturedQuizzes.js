import { useEffect, useState, useContext } from "react";
import { getQuizzes } from "../services/quizService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FeaturedQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        getQuizzes().then((data) => setQuizzes(data));
    }, []);

    const handleJoinQuiz = (quizId) => {
        if (!user) {
            alert("Bạn cần đăng nhập để tham gia quiz!");
            navigate("/login");
        } else {
            navigate(`/quiz/${quizId}`);
        }
    };

    return (
        <div>
            <Navbar />
            <section className="py-6 px-4 max-w-6xl mx-auto">
                <h2 className="text-2xl font-semibold text-center text-[#800000]">
                    Chọn 1 Bài Quiz Để Kiểm Tra Kiến Thức Của Bạn!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="border p-3 rounded-md shadow-sm bg-[#800000] text-white text-sm"
                        >
                            <h3 className="text-lg font-bold">{quiz.name}</h3>
                            <p className="text-gray-300">{quiz.instructions}</p>
                            <button
                                className="mt-3 px-3 py-2 bg-[#FFD700] text-[#800000] rounded hover:bg-[#FFC107] text-sm"
                                onClick={() => handleJoinQuiz(quiz._id)}
                            >
                                Tham gia ngay
                            </button>
                        </div>
                    ))}
                </div>

                {/* Nút Quay Về Trang Chủ */}
                <button
                    className="mt-6 px-4 py-2 bg-[#660000] text-white rounded font-semibold hover:bg-[#550000] transition duration-300 w-full max-w-xs mx-auto block"
                    onClick={() => navigate("/")}
                >
                    🔙 Quay về trang chủ
                </button>
            </section>
            <Footer />
        </div>
    );
};

export default FeaturedQuizzes;
