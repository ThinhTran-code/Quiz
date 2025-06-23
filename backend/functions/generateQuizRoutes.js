const { app } = require('@azure/functions');
const pdfParse = require('pdf-parse');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const axios = require('axios');
const Quiz = require('../shared/model/Quiz');
const connectDB = require('../shared/mongoose');

app.http('uploadQuizFromPDF', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload',
    handler: async (req, context) => {
        try {
            await connectDB();

            const formData = await req.formData();
            const file = formData.get("file");
            const category = formData.get("category") || "Khác";
            const name = formData.get("name") || "Tài liệu không tiêu đề";
            const instructions = formData.get("instructions") || "Chọn đáp án đúng nhất.";

            if (!file || !file.arrayBuffer) {
                throw new Error("Không tìm thấy file PDF hợp lệ trong formData.");
            }

            const buffer = Buffer.from(await file.arrayBuffer());

            const tmpDir = os.tmpdir();
            await fs.mkdir(tmpDir, { recursive: true });
            const filePath = path.join(tmpDir, file.name);

            await fs.writeFile(filePath, buffer);

            const fileBuffer = await fs.readFile(filePath);
            const pdfData = await pdfParse(fileBuffer);
            let textContent = pdfData.text;

            let quizTitle = textContent.split('\n')[0].trim();
            if (quizTitle.length > 50 || quizTitle.length < 5) {
                quizTitle = 'Ôn tập tự động';
            }

            textContent = textContent
                .replace(/\r/g, '')
                .replace(/\n{2,}/g, '\n')
                .replace(/([a-zA-Z0-9])\n(?=[a-zA-Z0-9])/g, '$1 ')
                .replace(/\t+/g, ' ')
                .trim();

            if (textContent.length > 10000) {
                textContent = textContent.slice(0, 10000);
            }

            const prompt = `
Dựa trên nội dung tài liệu sau, hãy tạo 10 câu hỏi trắc nghiệm.  
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
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o',
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    max_tokens: 2000,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const aiContent = response.data.choices[0].message.content;

            const rawQuestions = aiContent.split('\n\n').filter((q) => q.trim() !== '');
            const parsedQuestions = rawQuestions.map((block) => {
                const lines = block.split('\n').map((l) => l.trim());
                const questionLine = lines.find((l) => l.toLowerCase().startsWith('câu hỏi:'))?.slice(9).trim();

                const answers = lines
                    .filter((l) => /^[ABCD]\)/.test(l))
                    .map((l) => ({ option: l.slice(3).trim() }));

                const answerLine = lines.find((l) => l.toLowerCase().startsWith('đáp án'));
                const correctLetter = answerLine?.split(':')[1]?.trim()?.toUpperCase();
                const answerIndex = ['A', 'B', 'C', 'D'].indexOf(correctLetter);

                return {
                    question: questionLine || 'Câu hỏi không xác định',
                    answers,
                    answer: answerIndex !== -1 ? answerIndex : 0,
                    isEnabled: true,
                    explanation: '',
                };
            });

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const newQuiz = new Quiz({
                name: `${quizTitle} - ${timestamp}`,
                instructions,
                isEnabled: true,
                questions: parsedQuestions,
                duration: { minutes: 10 },
                category,
                source: 'AI',
            });

            const savedQuiz = await newQuiz.save();

            // Xóa file tạm
            await fs.unlink(filePath);

            return {
                status: 200,
                jsonBody: {
                    message: 'Quiz đã được tạo thành công',
                    quizId: savedQuiz._id,
                    questions: savedQuiz.questions,
                },
            };
        } catch (err) {
            context.error(err.message);
            return {
                status: 500,
                jsonBody: {
                    error: 'Không thể tạo quiz từ tài liệu.',
                    message: err.message,
                },
            };
        }
    },
});
