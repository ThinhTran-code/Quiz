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
            {" "}
            <Navbar />
            <section className="py-12 px-6">
                <h2 className="text-3xl font-semibold text-center text-[#800000]">
                    Chọn 1 Bài Quiz Để Kiểm Tra Kiến Thức Của Bạn!
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz._id}
                            className="border p-4 rounded-lg shadow-md bg-[#800000] text-white"
                        >
                            <h3 className="text-xl font-bold">{quiz.name}</h3>
                            <p className="text-gray-300">{quiz.instructions}</p>
                            <button
                                className="mt-4 px-4 py-2 bg-[#FFD700] text-[#800000] rounded-lg hover:bg-[#FFC107]"
                                onClick={() => handleJoinQuiz(quiz._id)}
                            >
                                Tham gia ngay
                            </button>
                        </div>
                    ))}
                </div>
                {/* Nút Quay Về Trang Chủ */}
                <button
                    className="mt-8 px-6 py-3 bg-[#660000] text-white rounded-lg font-semibold hover:bg-[#550000] transition duration-300 w-full max-w-xs"
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
