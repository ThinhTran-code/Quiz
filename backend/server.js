require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const connectionDB = require("./config/db");
const app = express();
const cors = require("cors");
const UserRoute = require("./routes/userRoute");
const QuizRoute = require("./routes/quizzRoute");
const QuizAttemptRoute = require("./routes/quizattemptRoute");
const GenerateQuiz = require("./routes/generateQuizRoutes");
connectionDB();
//Su dung cac middleware kiem soat requests tu client
app.use(express.json()); //loai du lieu lam viec tren web server
app.use(express.urlencoded({ extended: true })); // cho phep tiep nhan du lieu kieu multiple-form-data(upload file...)
app.use(morgan("dev"));
app.use(cors());
app.use("/api/auth", UserRoute);
app.use("/api/quizzes", QuizRoute);
app.use("/api/attemps", QuizAttemptRoute);
app.use("/profile", UserRoute);
app.use("/api/generate", GenerateQuiz);
app.listen(process.env.PORT, process.env.HOST_NAME, () => {
    console.log(
        `Server running at http://${process.env.HOST_NAME}:${process.env.PORT}`
    );
});
