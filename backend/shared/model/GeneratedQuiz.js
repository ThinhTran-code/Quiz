const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    label: String, // A, B, C, D
    text: String,
});

const questionSchema = new mongoose.Schema({
    question: String,
    options: [optionSchema],
    correctAnswer: String, // "A", "B", "C", "D"
});

const generatedQuizSchema = new mongoose.Schema({
    title: String, // Tùy bạn đặt
    createdAt: {
        type: Date,
        default: Date.now,
    },
    questions: [questionSchema],
});

module.exports = mongoose.model("GeneratedQuiz", generatedQuizSchema);
