import { useEffect, useState } from "react";
import { getHistoryByUser } from "../services/historyService";
import { useParams } from "react-router-dom";

const HistoryPage = () => {
    const { userId } = useParams();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        getHistoryByUser(userId).then((data) => setHistory(data));
    }, [userId]);

    return (
        <div className="max-w-2xl mx-auto mt-20">
            <h2 className="text-3xl font-bold text-[#660000] text-center">
                Lịch sử Quiz
            </h2>
            <div className="mt-6 space-y-4">
                {history.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <p className="font-semibold text-lg">
                            Quiz: {item.quiz.name}
                        </p>
                        <p>
                            Điểm: {item.score}/{item.totalQuestions}
                        </p>
                        <p>Câu trả lời đã chọn:</p>
                        <ul className="mt-2">
                            {item.answers.map((ans, i) => (
                                <li key={i} className="text-gray-700">
                                    - Câu {i + 1}: {ans.selectedAnswer} (
                                    {ans.isCorrect ? "✅ Đúng" : "❌ Sai"})
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
