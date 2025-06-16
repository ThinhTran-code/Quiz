import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { useContext } from "react";
import Profile from "./components/Profile";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import HistoryPage from "./pages/HistoryPage";
import Flashcard from "./components/FlashCard";
import FolderCategories from "./components/FolderCategories";
import CategoryFlashcards from "./components/CategoryFlashcards";
import TestCategories from "./components/TestCategories";
import CategoryTests from "./components/CategoryTests";
import TestDetail from "./components/TestDetail";
import QuizGenerator from "./components/QuizGenerator";
import QuizAIForm from "./components/QuizAIForm";
const ProtectedRoute = ({ element }) => {
    const { user } = useContext(AuthContext);
    return user ? element : <Login />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route
                        path="/profile"
                        element={<ProtectedRoute element={<Profile />} />}
                    />{" "}
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/result" element={<ResultPage />} />
                    <Route path="/history/:userId" element={<HistoryPage />} />
                    {/* <Route
                        path="/flashcards"
                        element={<FlashcardList />}
                    />{" "} */}
                    {/* 🛠 Trang danh sách quiz */}
                    {/* <Route path="/flashcard/:quizId" element={<Flashcard />} /> */}
                    {/* <Route path="/quiz" element={<FeaturedQuizzes />} /> */}
                    <Route path="/AIgenerate" element={<QuizGenerator />} />
                    <Route path="/flashcards" element={<FolderCategories />} />
                    <Route
                        path="/flashcards/:categoryName"
                        element={<CategoryFlashcards />}
                    />{" "}
                    <Route path="/flashcard/:quizId" element={<Flashcard />} />
                    <Route path="/tests" element={<TestCategories />} />
                    <Route
                        path="/tests/:categoryName"
                        element={<CategoryTests />}
                    />
                    <Route path="/test/:quizId" element={<TestDetail />} />
                    <Route path="/generatequiz" element={<QuizAIForm />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
