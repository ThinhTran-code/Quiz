import React from "react";
import logo from "../assets/quiz.jpg"; // Ảnh minh họa
import backgroundImage from "../assets/1.jpg"; // 📂 Đảm bảo đường dẫn đúng

const HeroSection = () => {
    return (
        <section
            className="text-center py-20 bg-cover bg-center bg-fixed text-white"
            style={{ backgroundImage: `url(${backgroundImage})` }} // ✅ Đặt ảnh nền
        >
            <div className="max-w-4xl mx-auto bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
                <h1 className="text-5xl font-bold leading-tight text-[#800000]">
                    Chào mừng bạn đến với QuizPro!
                </h1>
                <p className="text-lg mt-4 text-[#800000]">
                    Học tập qua các quiz thú vị và kiểm tra kiến thức của bạn.
                </p>
                <div className="flex justify-center mt-6 space-x-4">
                    <button className="px-6 py-3 bg-[#FFD700] text-[#800000] rounded-lg shadow-lg hover:bg-[#FFC107]">
                        Bắt đầu ngay
                    </button>
                    <button className="px-6 py-3 bg-white text-[#800000] rounded-lg shadow-lg hover:bg-gray-200">
                        Xem hướng dẫn
                    </button>
                </div>
            </div>

            {/* Hình minh họa */}
            <div className="flex justify-center mt-12">
                <img
                    src={logo}
                    alt="Quiz Illustration"
                    className="w-1/2 rounded-lg shadow-lg"
                />
            </div>
        </section>
    );
};

export default HeroSection;
