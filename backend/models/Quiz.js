const mongoose = require("mongoose");
const Schema = mongoose.Schema; // 🛠 Fix lỗi

const optionSchema = new Schema({
    option: { type: String, required: true },
});

const questionSchema = new Schema(
    {
        question: { type: String, required: true },
        answers: [optionSchema],
        answer: { type: Number, required: true },
        isEnabled: { type: Boolean, default: true },
        explanation: { type: String, default: "" },
    },
    { timestamps: true }
);

const quizSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        instructions: { type: String, required: true },
        isEnabled: { type: Boolean, default: true },
        // owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
        questions: [questionSchema],
        duration: {
            hours: { type: Number, default: 0 },
            minutes: { type: Number, default: 0 },
            seconds: { type: Number, default: 0 },
        },
        category: { type: String, required: true },
        source: {
            type: String,
            enum: ["user", "AI"],
            default: "user",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema, "quizzes");
