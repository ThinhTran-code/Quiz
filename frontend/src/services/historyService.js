import axios from "axios";

export const getHistoryByUser = async (userId) => {
    try {
        const response = await axios.get(
            `http://localhost:9999/api/history/${userId}`
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy lịch sử quiz:", error);
        throw error;
    }
};
