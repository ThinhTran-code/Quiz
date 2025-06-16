import axios from "axios";

const API_URL = "http://localhost:9999/api/quizzes";

export const getQuizzes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy quiz:", error);
        return [];
    }
};
// Lấy quiz theo ID
export const getQuizById = async (quizId) => {
    try {
        const response = await axios.get(`${API_URL}/${quizId}`);
        console.log("API Response:", response.data); // 👈 Kiểm tra phản hồi từ API
        return response.data;
    } catch (error) {
        console.error(
            "Lỗi khi lấy quiz theo ID:",
            error.response?.data || error.message
        );
        return null; // 👈 Trả về `null` để tránh lỗi undefined
    }
};
export const submitQuiz = async ({
    quizId,
    userId,
    answers,
    totalQuestions,
}) => {
    if (!totalQuestions || totalQuestions <= 0) {
        console.error("❌ Lỗi: totalQuestions không hợp lệ!", totalQuestions);
        throw new Error("Số lượng câu hỏi không hợp lệ.");
    }

    console.log("🧐 Gửi câu trả lời lên API:", {
        quizId,
        userId,
        answers,
        totalQuestions,
    });

    try {
        const response = await axios.post(
            "http://localhost:9999/api/quizzes/submit",
            {
                quizId,
                userId,
                answers,
                totalQuestions, // 🔥 Gửi số lượng câu hỏi lên API
            }
        );

        console.log("✅ Kết quả từ API:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "❌ Lỗi khi nộp bài:",
            error.response?.data || error.message
        );
        throw error;
    }
};
