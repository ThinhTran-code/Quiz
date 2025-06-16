import logo from "../assets/1.jpg"; // 📂 Đảm bảo đường dẫn đúng

const Footer = () => {
    return (
        <footer
            className="bg-cover bg-center text-[#660000] text-center py-6 mt-12 shadow-md"
            style={{ backgroundImage: `url(${logo})` }} // ✅ Đặt logo làm nền
        >
            <p className="text-sm bg-white bg-opacity-80 inline-block p-2 rounded-lg">
                &copy; {new Date().getFullYear()} QuizPro. Mọi quyền được bảo
                lưu.
            </p>
            <div className="flex justify-center space-x-6 mt-4 bg-white bg-opacity-80 inline-block p-2 rounded-lg">
                <a href="/about" className="hover:underline">
                    Giới thiệu
                </a>
                <a href="/contact" className="hover:underline">
                    Liên hệ
                </a>
                <a href="/privacy" className="hover:underline">
                    Chính sách bảo mật
                </a>
            </div>
        </footer>
    );
};

export default Footer;
