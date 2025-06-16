const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Đăng ký
router.post("/register", async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email đã tồn tại" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user", // <-- ĐẢM BẢO có dòng này
        });

        await user.save();

        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(404)
                .json({ message: "Người dùng không tồn tại" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Mật khẩu không đúng" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );

        console.log("✅ API trả về:", {
            token,
            userId: user._id,
            role: user.role,
        }); // 🔥 Kiểm tra log

        res.json({
            token,
            userId: user._id.toString(), // 🔥 Chuyển ObjectId thành string
            role: user.role,
            username: user.username,
        });
        // 🔥 Đảm bảo `userId` được trả về
    } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error.message);
        res.status(500).json({
            message: "Lỗi xử lý đăng nhập",
            error: error.message,
        });
    }
});
router.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Không có token" });

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await User.findById(decoded.userId).select("-password"); // Không trả về mật khẩu

        if (!user)
            return res
                .status(404)
                .json({ message: "Không tìm thấy người dùng" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Lỗi server", error: err.message });
    }
});

module.exports = router;
