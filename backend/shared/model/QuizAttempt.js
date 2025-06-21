const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attemptSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        quiz: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
        answers: [
            {
                questionId: { type: Schema.Types.ObjectId, required: true },
                selectedAnswer: { type: Number, required: true }, // 🛠 Dùng tên rõ hơn
                isCorrect: { type: Boolean, required: true },
            },
        ],
        score: { type: Number, default: 0 },
        totalQuestions: { type: Number, required: true },
    },
    { timestamps: true } // 🛠 Tự động lưu thời gian tạo & cập nhật
);

module.exports = mongoose.model("QuizAttempt", attemptSchema);
