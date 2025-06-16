import { useState, useContext } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);
    const handleLogin = async () => {
        try {
            const response = await loginUser({ email, password });

            console.log("🔍 API trả về khi đăng nhập:", response); // 🔥 Kiểm tra toàn bộ dữ liệu từ API

            if (!response.userId) {
                console.error("❌ API không trả về userId!");
                alert("Lỗi đăng nhập! Không tìm thấy userId.");
                return;
            }

            const userData = {
                token: response.token,
                role: response.role,
                userId: response.userId,
                username: response.username,
            };

            localStorage.setItem("token", userData.token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("userId", userData.userId); // 🔥 Lưu `userId` vào localStorage

            setUser(userData);
            alert("Đăng nhập thành công!");
            navigate("/");
        } catch (error) {
            alert(
                "Lỗi đăng nhập: " + error.response?.data?.message ||
                    "Có lỗi xảy ra"
            );
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
                <h2 className="text-3xl font-bold text-[#660000] text-center">
                    Đăng nhập vào QuizPro
                </h2>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mt-4 border rounded-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="w-full p-3 mt-2 border rounded-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="w-full mt-6 bg-[#800000] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#660000] transition duration-300"
                    onClick={handleLogin}
                >
                    Đăng nhập
                </button>
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">
                        Chưa có tài khoản?
                    </span>{" "}
                    <span
                        className="text-sm text-[#660000] font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate("/signup")}
                    >
                        Đăng ký ngay
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
