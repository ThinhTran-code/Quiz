const { app } = require("@azure/functions");
const Quiz = require("../shared/model/Quiz");
const QuizAttempt = require("../shared/model/QuizAttempt");
const connectDB = require("../shared/mongoose");
const verifyToken = require("../shared/middleware/authmiddleware");
const verifyAdmin = require("../shared/middleware/authmiddleware");

app.http("getQuizzesByCategory", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "category/{categoryName}",
    handler: async (req, context) => {
        try {
            await connectDB();
            const categoryName = req.params.categoryName;
            const quizzes = await Quiz.aggregate([
                {
                    $match: {
                        category: categoryName,
                        isEnabled: true,
                    },
                },
                {
                    $project: {
                        name: 1,
                        instructions: 1,
                        createdAt: 1,
                        questionsCount: { $size: "$questions" },
                    },
                },
            ]);

            if (quizzes.length === 0) {
                return {
                    status: 404,
                    jsonBody: {
                        message: "Không tìm thấy quiz thuộc category này",
                    },
                };
            }

            return { status: 200, jsonBody: quizzes };
        } catch (err) {
            return { status: 500, jsonBody: { message: "Lỗi server" } };
        }
    },
});

app.http("createQuiz", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "create",
    handler: async (req, context) => {
        try {
            await connectDB();

            const authHeader = req.headers.get("authorization");
            const token = authHeader?.split(" ")[1];
            const user = verifyToken(token);
            if (!user || !verifyAdmin(user)) {
                return {
                    status: 403,
                    jsonBody: { message: "Không có quyền truy cập" },
                };
            }

            const body = await req.json();
            const { name, instructions, questions, duration, category } = body;

            if (!category) {
                return {
                    status: 400,
                    jsonBody: { message: "Quiz cần có category" },
                };
            }

            const quiz = await Quiz.create({
                name,
                instructions,
                questions,
                duration,
                category,
                owner: user.userId,
                source: "ai",
            });

            return { status: 201, jsonBody: quiz };
        } catch (err) {
            return { status: 500, jsonBody: { message: err.message } };
        }
    },
});

app.http("getAllQuizzes", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "quizzes",
    handler: async (req, context) => {
        try {
            await connectDB();
            const quizzes = await Quiz.find({ isEnabled: true }).select(
                "name instructions duration category"
            );
            return { status: 200, jsonBody: quizzes };
        } catch (err) {
            return { status: 500, jsonBody: { message: err.message } };
        }
    },
});

const { isValidObjectId } = require("mongoose");

app.http("getFlashcardById", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "flashcard/{id}",
    handler: async (req, context) => {
        try {
            await connectDB();

            const id = req.params?.id;
            console.log("📦 Received ID:", id);

            if (!id) {
                return {
                    status: 400,
                    jsonBody: { message: "Thiếu ID trong URL" },
                };
            }

            if (!isValidObjectId(id)) {
                return {
                    status: 400,
                    jsonBody: { message: "ID không hợp lệ" },
                };
            }

            const quiz = await Quiz.findById(id);
            if (!quiz || !quiz.isEnabled) {
                return {
                    status: 404,
                    jsonBody: {
                        message: "Quiz không tồn tại hoặc bị vô hiệu hóa",
                    },
                };
            }

            return { status: 200, jsonBody: quiz };
        } catch (err) {
            console.error("❌ Lỗi hệ thống:", err.message);
            return { status: 500, jsonBody: { message: err.message } };
        }
    },
});

app.http("getQuizById", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "test/{id}",
    handler: async (req, context) => {
        try {
            await connectDB();

            const id = req.params?.id;
            console.log("📦 Received ID:", id);

            if (!id) {
                return {
                    status: 400,
                    jsonBody: { message: "Thiếu ID trong URL" },
                };
            }

            if (!isValidObjectId(id)) {
                return {
                    status: 400,
                    jsonBody: { message: "ID không hợp lệ" },
                };
            }

            const quiz = await Quiz.findById(id);
            if (!quiz || !quiz.isEnabled) {
                return {
                    status: 404,
                    jsonBody: {
                        message: "Quiz không tồn tại hoặc bị vô hiệu hóa",
                    },
                };
            }

            return { status: 200, jsonBody: quiz };
        } catch (err) {
            console.error("❌ Lỗi hệ thống:", err.message);
            return { status: 500, jsonBody: { message: err.message } };
        }
    },
});


app.http("submitQuizWithDetails", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "submit",
    handler: async (req, context) => {
        try {
            await connectDB();
            const body = await req.json();
            const { quizId, userId, answers } = body;

            if (!quizId || !userId || !answers || !Array.isArray(answers)) {
                return {
                    status: 400,
                    jsonBody: { message: "Thiếu thông tin cần thiết" },
                };
            }

            const quiz = await Quiz.findById(quizId);
            if (!quiz) {
                return {
                    status: 404,
                    jsonBody: { message: "Quiz không tồn tại" },
                };
            }

            if (answers.length !== quiz.questions.length) {
                return {
                    status: 400,
                    jsonBody: {
                        message: `Bạn cần làm tất cả câu hỏi. Tổng câu hỏi: ${quiz.questions.length}, bạn trả lời: ${answers.length}`,
                    },
                };
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

            const quizAttempt = new QuizAttempt({
                user: userId,
                quiz: quizId,
                totalQuestions: quiz.questions.length,
                answers: processedAnswers,
                score,
            });

            await quizAttempt.save();

            return {
                status: 200,
                jsonBody: { message: "Nộp bài thành công!", quizAttempt },
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: {
                    message: "Lỗi xử lý kết quả quiz",
                    error: err.message,
                },
            };
        }
    },
});

app.http("getFlashcards", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "{quizId}/flashcards",
    handler: async (req, context) => {
        try {
            await connectDB();
            const quiz = await Quiz.findById(req.params.quizId);
            if (!quiz) {
                return {
                    status: 404,
                    jsonBody: { error: "Quiz không tồn tại" },
                };
            }

            const flashcards = quiz.questions.map((q) => ({
                question: q.question,
                answer:
                    q.explanation ||
                    q.answers[q.answer]?.option ||
                    "Không có đáp án",
            }));

            return { status: 200, jsonBody: flashcards };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { error: "Lỗi khi lấy flashcards" },
            };
        }
    },
});
