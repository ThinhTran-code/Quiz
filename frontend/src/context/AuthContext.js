import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedUserId = localStorage.getItem("userId");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                if (!storedUserId) {
                    localStorage.setItem("userId", parsedUser.userId);
                }

                console.log(
                    "✅ Lưu userId vào localStorage:",
                    parsedUser.userId
                );
            } catch (error) {
                console.error("❌ Lỗi khi parse JSON:", error);
                localStorage.removeItem("user");
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
