import React from "react";
import { useNavigate } from "react-router-dom"; // 👈 Thêm dòng này
import formBackground from "../assets/123.jpg";
import logo from "../assets/sniping.png";

const QuizGenerator = () => {
    const navigate = useNavigate(); // 👈 Hook để điều hướng

    const handleNavigate = () => {
        navigate("/generatequiz");
    };

    return (
        <div
            className="bg-[#184B4F] text-[#660000] rounded-xl p-6 md:p-10 shadow-xl flex items-center justify-between w-full max-w-3xl mx-auto mt-10"
            style={{
                backgroundImage: `url(${formBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <img src={logo} alt="AI Illustration" className="w-24 md:w-36" />

            <div className="text-right ml-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-2">A.I.</h2>
                <p className="text-base md:text-lg font-medium mb-4">
                    Generate a quiz from <br /> any subject or PDF
                </p>
                <button
                    onClick={handleNavigate} // 👈 Gọi hàm điều hướng
                    className="bg-[#FFD700] text-[#660000] font-bold px-5 py-2 rounded-full shadow-md hover:bg-[#D97300] transition"
                >
                    Quiz generator
                </button>
            </div>
        </div>
    );
};

export default QuizGenerator;
