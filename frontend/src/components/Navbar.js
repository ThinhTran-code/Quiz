import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoQuizPro_navbar_48px.png"; // 📂 Đảm bảo đường dẫn đúng

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    console.log("User state:", user);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="bg-[#EAF3FA] text-[#660000] p-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <Link to="/" className="flex items-center">
                <img
                    src={logo}
                    alt="QuizPro Logo"
                    className="w-12 h-12 object-contain"
                />
            </Link>

            {/* Navbar links */}
            <div className="flex items-center space-x-6">
                <Link
                    to="/"
                    className="font-semibold hover:underline flex-1 text-left"
                >
                    Home
                </Link>
                <Link to="/quizzes" className="hover:underline">
                    Quizzes
                </Link>

                {user ? (
                    <div className="flex items-center space-x-4">
                        <Link to="/profile">
                            <span className="text-sm italic text-[#2C3E50]">
                                Xin chào, {user.username}
                            </span>
                        </Link>
                        <button
                            className="bg-white text-[#660000] px-4 py-2 rounded-lg hover:bg-gray-200"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link
                        to="/login"
                        className="bg-white text-[#660000] px-4 py-2 rounded-lg hover:bg-gray-200"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
