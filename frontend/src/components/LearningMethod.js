import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/2.jpg";

const LearningMethods = () => {
    const navigate = useNavigate();

    const handleClick = (path) => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập để sử dụng chức năng này!");
            navigate("/login");
            return;
        }
        navigate(path);
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <h1 className="text-3xl font-bold mb-8 text-center text-white">
                Bạn muốn học như thế nào?
            </h1>

            <div className="flex justify-center gap-6 w-full max-w-screen-md flex-wrap">
                {/* Thẻ ghi nhớ */}
                <div
                    className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg text-center border-2 border-[#660000] w-72 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => handleClick("/flashcards")}
                >
                    <h2 className="text-lg font-semibold text-[#660000] mb-3">
                        Thẻ ghi nhớ
                    </h2>
                    <div className="w-full h-40 bg-[#F8F6F2] bg-opacity-80 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                            src="https://images.prismic.io/quizlet-web/ZuOC3LVsGrYSvUXG_VI-VN2Flashcards.png?auto=format,compress"
                            alt="Flashcards"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>

                {/* Kiểm tra */}
                <div
                    className="bg-white bg-opacity-80 p-4 rounded-lg shadow-lg text-center border-2 border-[#F8F6F2] w-72 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                    onClick={() => handleClick("/tests")}
                >
                    <h2 className="text-lg font-semibold text-[#660000] mb-3">
                        Kiểm tra
                    </h2>
                    <div className="w-full h-40 bg-[#F8F6F2] bg-opacity-80 rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                            src="https://images.prismic.io/quizlet-web/ZuOC6LVsGrYSvUXH_VI-VN6Test.png?auto=format,compress"
                            alt="Test"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
            </div>

            <button
                className="mt-8 bg-white text-[#660000] text-base px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 shadow-md transition duration-200"
                onClick={() => navigate("/signup")}
            >
                Đăng ký miễn phí
            </button>
        </div>
    );
};

export default LearningMethods;
