const Testimonials = () => {
    const testimonials = [
        {
            name: "Nguyễn Yến Nhi",
            role: "Sinh Viên FPT",
            comment:
                "“Tôi sử dụng QuizPro để củng cố và kiểm tra sự hiểu biết sau khi tôi đã học khá kỹ một khái niệm... Nó rất tiện lợi, tôi có thể học nó mọi lúc.”",
            color: { bg: "bg-pink-100", border: "border-pink-400" },
            image: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
            name: "Trương Mã Hóa",
            role: "Sinh Viên Thanh Hoa",
            comment:
                "“QuizPro tạo động lực cho học sinh, dù học ở bên nước ngoài nhưng tôi vẫn có thể học thêm những kiến thức về lịch sử Việt Nam nhờ có QuizPro.”",
            color: { bg: "bg-blue-100", border: "border-blue-400" },
            image: "https://randomuser.me/api/portraits/men/32.jpg",
        },
        {
            name: "Bùi Tố Cẩm",
            role: "Sinh Viên FPT",
            comment:
                "“Nhờ có QuizPro mà tôi và các bạn học của mình có thể vượt qua kỳ thi cuối kỳ tại FPT một cách dễ dàng”",
            color: { bg: "bg-yellow-100", border: "border-yellow-400" },
            image: "https://randomuser.me/api/portraits/women/51.jpg",
        },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-50">
            {testimonials.map((t, index) => (
                <div
                    key={index}
                    className={`w-80 rounded-xl border-t-4 p-6 shadow-md ${t.color.bg} ${t.color.border}`}
                >
                    <div className="flex items-center space-x-4 mb-4">
                        <img
                            src={t.image}
                            alt={t.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="text-sm font-semibold text-[#800000]">
                                {t.name}
                            </h3>
                            <p className="text-sm text-[#800000]">{t.role}</p>
                        </div>
                    </div>
                    <p className="text-sm text-[#800000]">{t.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default Testimonials;
