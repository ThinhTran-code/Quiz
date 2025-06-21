const { app } = require('@azure/functions');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const fs = require('fs/promises');
const axios = require('axios');
const Quiz = require('../shared/model/Quiz');
const connectDB = require('../shared/mongoose');

const upload = multer({ dest: '/tmp' });

const parseFormData = (req, res) =>
    new Promise((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err) reject(err);
            else resolve(req.file);
        });
    });

app.http('uploadQuizFromPDF', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload',
    handler: async (req, context) => {
        try {
            await connectDB();
            const [reqRaw, resRaw] = [req, {}];
            const file = await parseFormData(reqRaw, resRaw);
            const filePath = file.path;

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
                instructions: 'Trả lời các câu hỏi sau',
                isEnabled: true,
                questions: parsedQuestions,
                duration: { minutes: 10 },
                category: req.query.get('category') || 'Khác',
                source: 'AI',
            });

            const savedQuiz = await newQuiz.save();
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
