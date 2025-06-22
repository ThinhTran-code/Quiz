import axios from "axios";

// const API_URL = "http://localhost:9999/api/auth"; // 👈 Đảm bảo backend đang chạy đúng port

// Đăng ký người dùng
export const registerUser = async (userData) => {
    try {
        // const response = await axios.post(`${API_URL}/register`, userData);
        const response = await axios.post(`register`, userData);
        return response.data;
    } catch (error) {
        console.error(
            "Lỗi khi đăng ký:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// Đăng nhập người dùng
export const loginUser = async (userData) => {
    try {
        // const response = await axios.post(`${API_URL}/login`, userData);
        const response = await axios.post(`login`, userData);

        console.log(response.data); // 👈 Kiểm tra log API trả về
        return response.data; // Đảm bảo API trả về `{ token, user }`
    } catch (error) {
        console.error(
            "Lỗi khi đăng nhập:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const getUserProfile = async (token) => {
    try {
        // const response = await axios.get(`${API_URL}/profile`, {
        //     headers: { Authorization: `Bearer ${token}` },
        // });
        const response = await axios.get(`profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error(
            "Lỗi khi lấy thông tin người dùng:",
            error.response?.data || error.message
        );
        throw error;
    }
};
