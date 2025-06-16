import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import backgroundImage from "../assets/11.jpg"; // 📂 Đặt ảnh nền phù hợp

const ResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const score = params.get("score") || "0";
    const total = params.get("total") || "0";

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />

                {/* 🎯 Form kết quả lớn hơn, hiển thị đẹp hơn */}
                <div className="relative z-10 bg-white p-10 rounded-xl shadow-2xl w-[28rem] text-center">
                    <h2 className="text-4xl font-bold text-[#660000] mb-6">
                        🎯 Kết quả bài quiz
                    </h2>
                    <p className="text-xl text-gray-700">
                        Bạn đạt được{" "}
                        <b className="text-[#660000] text-2xl">
                            {score}/{total}
                        </b>{" "}
                        câu đúng!
                    </p>

                    {/* 🔥 Hiệu ứng động nhẹ */}
                    <div className="mt-6 text-5xl animate-bounce">🏆</div>

                    <button
                        className="mt-8 px-8 py-4 bg-[#800000] text-white text-lg rounded-lg hover:bg-[#660000] transition duration-300 shadow-lg"
                        onClick={() => navigate("/")}
                    >
                        🔙 Quay về trang chủ
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ResultPage;
