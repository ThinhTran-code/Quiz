const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user", // mặc định là người dùng bình thường
        },
        quizzes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Quiz",
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema, "users");
