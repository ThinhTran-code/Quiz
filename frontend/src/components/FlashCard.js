import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";
import backgroundImage from "../assets/7.jpg";

const Flashcard = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [autoFlip, setAutoFlip] = useState(false); // 🛠 Tự động lật sau X giây

    useEffect(() => {
        axios
            .get(`http://localhost:9999/api/quizzes/${quizId}/flashcards`)
            .then((response) => setCards(response.data))
            .catch((error) => console.error("Lỗi khi tải flashcards:", error));
    }, [quizId]);

    useEffect(() => {
        if (autoFlip) {
            const timer = setTimeout(() => handleFlip(), 2000);
            return () => clearTimeout(timer);
        }
    }, [currentIndex, flipped, autoFlip]);

    const handleNext = () => {
        setFlipped(false);
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        setFlipped(false);
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <div>
            <Navbar />
            <div
                className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-fixed p-6"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-50"></div>{" "}
                {/* 📌 Overlay giúp chữ rõ hơn */}
                <h1 className="relative text-3xl font-bold mb-6 text-white">
                    Học bằng Flashcard
                </h1>
                {/* 🏆 Progress Bar */}
                <div className="relative w-full max-w-md bg-gray-300 rounded-full h-2 mb-4">
                    <div
                        className="absolute bg-[#660000] h-2 rounded-full"
                        style={{
                            width: `${
                                ((currentIndex + 1) / cards.length) * 100
                            }%`,
                        }}
                    ></div>
                </div>
                <p className="text-white text-sm">
                    Thẻ {currentIndex + 1} / {cards.length}
                </p>
                {cards.length > 0 ? (
                    <div
                        className="w-[20rem] h-[12rem] bg-white bg-opacity-90 p-6 rounded-lg shadow-xl flex items-center justify-center text-center cursor-pointer transform transition hover:scale-105"
                        onClick={handleFlip}
                    >
                        <p className="text-xl font-semibold text-[#660000]">
                            {flipped
                                ? cards[currentIndex].answer
                                : cards[currentIndex].question}
                        </p>
                    </div>
                ) : (
                    <p className="text-lg text-white">Đang tải flashcards...</p>
                )}
                {/* 🛠 Nút điều hướng */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handlePrevious}
                        className="bg-white text-[#660000] px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 shadow-md"
                    >
                        Quay lại
                    </button>

                    <button
                        onClick={handleNext}
                        className="bg-white text-[#660000] px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 shadow-md"
                    >
                        Tiếp theo
                    </button>
                </div>
                {/* 🔁 Nút Tự Động Lật */}
                <button
                    onClick={() => setAutoFlip(!autoFlip)}
                    className={`mt-6 px-6 py-2 rounded-lg font-semibold shadow-md ${
                        autoFlip
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-300 text-[#660000]"
                    } hover:bg-gray-400`}
                >
                    {autoFlip ? "Tự động lật: BẬT" : "Tự động lật: TẮT"}
                </button>
                {/* 🛠 Nút "Quay Lại Chọn Chủ Đề" */}
                <button
                    onClick={() => navigate("/flashcards")}
                    className="mt-6 bg-gray-300 text-[#660000] px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 shadow-md"
                >
                    Quay Lại Chọn Chủ Đề
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default Flashcard;
