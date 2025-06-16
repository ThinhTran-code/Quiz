import { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            alert("Mật khẩu không trùng khớp!");
            return;
        }

        try {
            await registerUser({ username, email, password });
            alert("Đăng ký thành công!");
            navigate("/login");
        } catch (error) {
            alert(
                "Lỗi đăng ký: " + error.response?.data?.message ||
                    "Có lỗi xảy ra"
            );
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200">
            <div className="bg-white p-10 rounded-xl shadow-2xl w-96">
                <h2 className="text-3xl font-bold text-[#660000] text-center">
                    Đăng ký tài khoản
                </h2>
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    className="w-full p-3 mt-4 border rounded-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 mt-2 border rounded-lg"
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
                <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="w-full p-3 mt-2 border rounded-lg"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                    className="w-full mt-6 bg-[#800000] text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#660000] transition duration-300"
                    onClick={handleSignup}
                >
                    Đăng ký
                </button>
            </div>
        </div>
    );
};

export default Signup;
