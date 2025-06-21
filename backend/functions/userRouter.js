const { app } = require('@azure/functions');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../shared/model/User');
const connectDB = require('../shared/mongoose');

app.http('registerUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: '/register',
    handler: async (req, context) => {
        try {
            await connectDB();
            const { username, email, password, role } = await req.json();

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return { status: 400, jsonBody: { message: 'Email đã tồn tại' } };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                email,
                password: hashedPassword,
                role: role || 'user',
            });

            await user.save();

            return { status: 201, jsonBody: { message: 'Đăng ký thành công' } };
        } catch (err) {
            return { status: 500, jsonBody: { message: err.message } };
        }
    },
});

app.http('loginUser', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: '/login',
    handler: async (req, context) => {
        try {
            await connectDB();
            const { email, password } = await req.json();

            const user = await User.findOne({ email });
            if (!user) {
                return { status: 404, jsonBody: { message: 'Người dùng không tồn tại' } };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { status: 400, jsonBody: { message: 'Mật khẩu không đúng' } };
            }

            const token = jwt.sign(
                { userId: user._id, role: user.role },
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );

            return {
                status: 200,
                jsonBody: {
                    token,
                    userId: user._id.toString(),
                    role: user.role,
                    username: user.username,
                },
            };
        } catch (err) {
            return {
                status: 500,
                jsonBody: { message: 'Lỗi xử lý đăng nhập', error: err.message },
            };
        }
    },
});

app.http('getUserProfile', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: '/profile',
    handler: async (req, context) => {
        try {
            await connectDB();
            const authHeader = req.headers.get('authorization');
            const token = authHeader?.split(' ')[1];

            if (!token) {
                return { status: 401, jsonBody: { message: 'Không có token' } };
            }

            const decoded = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findById(decoded.userId).select('-password');

            if (!user) {
                return { status: 404, jsonBody: { message: 'Không tìm thấy người dùng' } };
            }

            return { status: 200, jsonBody: user };
        } catch (err) {
            return { status: 500, jsonBody: { message: 'Lỗi server', error: err.message } };
        }
    },
});
