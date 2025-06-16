const express = require("express");
const Quiz = require("../models/Quiz");
const auth = require("../middleware/authmiddleware");
const QuizAttempt = require("../models/QuizAttempt");
const authorizeAdmin = require("../middleware/authorizeAdmin");
const router = express.Router();

// 📌 Lấy tất cả quiz theo category
router.get("/category/:categoryName", async (req, res) => {
    try {
        const quizzes = await Quiz.find({
            category: req.params.categoryName,
            isEnabled: true,
        }).select("name instructions duration");
        if (quizzes.length === 0) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy quiz thuộc category này" });
        }
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 📌 Tạo quiz mới – admin cần nhập category
router.post("/create", auth, authorizeAdmin, async (req, res) => {
    try {
        const { name, instructions, questions, duration, category } = req.body;
        if (!category) {
            return res.status(400).json({ message: "Quiz cần có category" });
        }

        const quiz = await Quiz.create({
            name,
            instructions,
            questions,
            duration,
            category, // ✅ Thêm category vào quiz
            owner: req.user.userId,
            source: "ai",
        });

        res.status(201).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isEnabled: true }).select(
            "name instructions duration category"
        );
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz || !quiz.isEnabled) {
            return res
                .status(404)
                .json({ message: "Quiz không tồn tại hoặc bị vô hiệu hóa" });
        }
        res.json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/submit", async (req, res) => {
    console.log("📡 API nhận dữ liệu:", req.body);

    const { quizId, userId, answers, totalQuestions } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!quizId || !userId || !answers || !Array.isArray(answers)) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
    }

    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz)
            return res.status(404).json({ message: "Quiz không tồn tại" });

        // ✅ Kiểm tra số lượng câu trả lời phải khớp với số câu hỏi
        if (answers.length !== quiz.questions.length) {
            return res.status(400).json({
                message: `Bạn cần làm tất cả câu hỏi. Tổng câu hỏi: ${quiz.questions.length}, bạn trả lời: ${answers.length}`,
            });
        }

        let score = 0;

        const processedAnswers = answers.map((userAns) => {
            const question = quiz.questions.find(
                (q) => q._id.toString() === userAns.questionId.toString()
            );

            if (!question) {
                return {
                    questionId: userAns.questionId,
                    selectedAnswer: userAns.selectedAnswer,
                    isCorrect: false,
                };
            }

            const selected = Number(userAns.selectedAnswer);
            const correct = Number(question.answer);
            const isCorrect = selected === correct;

            if (isCorrect) score++;

            return {
                questionId: userAns.questionId,
                selectedAnswer: selected,
                isCorrect,
            };
        });

        console.log("✅ Tổng số câu đúng:", score);

        const quizAttempt = new QuizAttempt({
            user: userId,
            quiz: quizId,
            totalQuestions: quiz.questions.length,
            answers: processedAnswers,
            score,
        });

        await quizAttempt.save();
        console.log("✅ QuizAttempt lưu thành công:", quizAttempt);

        res.json({ message: "Nộp bài thành công!", quizAttempt });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi xử lý kết quả quiz",
            error: error.message,
        });
    }
});

// 📌 Lấy flashcards từ quiz
router.get("/:quizId/flashcards", async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ error: "Quiz không tồn tại" });

        const flashcards = quiz.questions.map((q) => ({
            question: q.question,
            answer:
                q.explanation ||
                (q.answers[q.answer]?.option ?? "Không có đáp án"),
        }));

        res.json(flashcards);
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi lấy flashcards" });
    }
});
router.get("/category/:categoryName", async (req, res) => {
    try {
        const quizzes = await Quiz.find({
            category: req.params.categoryName,
            isEnabled: true,
        }).lean();

        console.log("🔥 Dữ liệu Mongo:", quizzes);

        if (quizzes.length === 0) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy quiz thuộc category này" });
        }
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
