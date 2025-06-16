const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const auth = require("../middleware/authmiddleware");
// Lấy danh sách lịch sử làm bài của user
router.post("/", auth, async (req, res) => {
    try {
        const { quizId, answers } = req.body;

        // Lấy thông tin quiz theo ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz không tồn tại" });
        }

        let score = 0;
        const processedAnswers = [];

        // Duyệt từng câu hỏi để so sánh đáp án
        quiz.questions.forEach((q, index) => {
            const userAnswer = answers[index]; // user gửi về: [0, 2, 1, ...]
            const isCorrect = q.answer === userAnswer;

            if (isCorrect) score++;

            processedAnswers.push({
                questionId: q._id,
                answerIndex: userAnswer,
                isCorrect,
            });
        });

        // Lưu kết quả attempt
        const attempt = await QuizAttempt.create({
            user: req.user.userId,
            quiz: quiz._id,
            answers: processedAnswers,
            score,
            totalQuestions: quiz.questions.length,
        });

        res.status(201).json({
            message: "Nộp bài thành công",
            attemptId: attempt._id,
            score: attempt.score,
            total: attempt.totalQuestions,
            answers: processedAnswers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server khi xử lý bài làm" });
    }
});

module.exports = router;
