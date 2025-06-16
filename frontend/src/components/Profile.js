// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { getUserProfile } from "../services/userService";
// import { useNavigate } from "react-router-dom";
// import Navbar from "./Navbar";
// import Footer from "./Footer";

// const Profile = () => {
//     const { user, setUser } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const [avatar, setAvatar] = useState(
//         localStorage.getItem("avatar") || "/images/default-avatar.png"
//     );
//     const [userData, setUserData] = useState(null);

//     useEffect(() => {
//         const fetchProfile = async () => {
//             const token = localStorage.getItem("token");
//             if (token) {
//                 try {
//                     const data = await getUserProfile(token);
//                     setUserData(data);
//                 } catch (error) {
//                     console.error("Lỗi khi lấy profile:", error);
//                 }
//             }
//         };
//         fetchProfile();
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("avatar");
//         setUser(null);
//         navigate("/");
//     };

//     const handleUpload = (event) => {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = (e) => {
//                 setAvatar(e.target.result);
//                 localStorage.setItem("avatar", e.target.result);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     return (
//         <div>
//             <Navbar />
//             <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
//                 <div className="bg-white p-10 rounded-xl shadow-2xl w-96 text-center">
//                     <h2 className="text-3xl font-bold text-[#660000]">
//                         Hồ sơ của bạn
//                     </h2>

//                     {/* Ảnh đại diện */}
//                     <div className="mt-6">
//                         <img
//                             src={avatar}
//                             alt="Avatar"
//                             className="w-24 h-24 rounded-full mx-auto border border-gray-300 shadow-md"
//                         />
//                         <input
//                             type="file"
//                             accept="image/*"
//                             className="mt-4 w-full text-sm"
//                             onChange={handleUpload}
//                         />
//                     </div>

//                     {/* Thông tin người dùng */}
//                     {userData && (
//                         <>
//                             <p className="mt-6 text-lg">
//                                 👤 <b>{userData.username}</b>
//                             </p>
//                             <p className="mt-2 text-lg">📧 {userData.email}</p>
//                             <p className="mt-2 text-lg">
//                                 ⭐ Vai trò: {userData.role}
//                             </p>
//                         </>
//                     )}

//                     <div className="mt-6 flex justify-center gap-4">
//                         <button
//                             className="px-6 py-3 bg-gray-300 text-[#660000] rounded-lg hover:bg-gray-400 transition duration-300"
//                             onClick={() => navigate("/")}
//                         >
//                             Trở về
//                         </button>

//                         <button
//                             className="px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#660000] transition duration-300"
//                             onClick={handleLogout}
//                         >
//                             Đăng xuất
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default Profile;
