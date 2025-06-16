const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();
const Quiz = require("../models/Quiz");
const upload = multer({ dest: "uploads/" });

// 📤 POST /api/generate/upload
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        // 📄 Đọc nội dung PDF
        const fileBuffer = fs.readFileSync(req.file.path);
        console.log("📥 File nhận được:", req.file);

        const pdfData = await pdfParse(fileBuffer);
        let textContent = pdfData.text;
        let quizTitle = textContent.split("\n")[0].trim();
        if (quizTitle.length > 50 || quizTitle.length < 5) {
            quizTitle = "Ôn tập tự động";
        }
        // 🧹 Làm sạch format text sau khi extract từ PDF
        textContent = textContent
            .replace(/\r/g, "") // loại bỏ ký tự xuống dòng \r
            .replace(/\n{2,}/g, "\n") // bỏ nhiều dòng trắng liền nhau
            .replace(/([a-zA-Z0-9])\n(?=[a-zA-Z0-9])/g, "$1 ") // gộp dòng bị ngắt giữa từ
            .replace(/\t+/g, " ") // thay tab thành dấu cách
            .trim();

        // Nếu Dài hơn 10 nghìn ký tự thì tự động cắt ngắn
        if (textContent.length > 10000) {
            textContent = textContent.slice(0, 10000);
        }
        console.log("🔍 PDF length:", textContent.length);

        //  Prompt
        const prompt = `
Dựa trên nội dung tài liệu sau, hãy tạo 5 câu hỏi trắc nghiệm.  
Mỗi câu gồm 4 lựa chọn và 1 đáp án đúng.  
Trình bày như sau:

---
Câu hỏi: ...
A) ...
B) ...
C) ...
D) ...
Đáp án: ...
---

Dưới đây là nội dung tài liệu:

${textContent}
`;

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 1500,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Xóa file cũ đi khi mà up file mới
        fs.unlinkSync(req.file.path);

        const aiContent = response.data.choices[0].message.content;

        //  Parse câu hỏi từ text
        const rawQuestions = aiContent
            .split("\n\n")
            .filter((q) => q.trim() !== "");

        const parsedQuestions = rawQuestions.map((block) => {
            const lines = block.split("\n").map((l) => l.trim());

            const questionLine = lines
                .find((l) => l.toLowerCase().startsWith("câu hỏi:"))
                ?.slice(9)
                .trim();

            const answers = lines
                .filter((l) => /^[ABCD]\)/.test(l))
                .map((l) => ({
                    option: l.slice(3).trim(),
                }));

            const answerLine = lines.find((l) =>
                l.toLowerCase().startsWith("đáp án")
            );
            const correctLetter = answerLine
                ?.split(":")[1]
                ?.trim()
                ?.toUpperCase();
            const answerIndex = ["A", "B", "C", "D"].indexOf(correctLetter);

            return {
                question: questionLine || "Câu hỏi không xác định",
                answers,
                answer: answerIndex !== -1 ? answerIndex : 0,
                isEnabled: true,
                explanation: "",
            };
        });

        //  Lưu quiz vào MongoDB
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

        const newQuiz = new Quiz({
            name: `${quizTitle} - ${timestamp}`,
            instructions: "Trả lời các câu hỏi sau",
            isEnabled: true,
            questions: parsedQuestions,
            duration: { minutes: 10 },
            category: req.body.category || "Khác",
            source: "AI",
            // owner: req.user?._id,
        });

        const savedQuiz = await newQuiz.save();

        res.json({
            message: "Quiz đã được tạo thành công",
            quizId: savedQuiz._id,
            questions: savedQuiz.questions,
        });
    } catch (error) {
        console.error("❌ Error generating/saving quiz:", error.message);
        if (error.response) {
            console.error("🔁 Response data:", error.response.data);
        }
        res.status(500).json({ error: "Không thể tạo quiz từ tài liệu." });
    }
});

module.exports = router;
