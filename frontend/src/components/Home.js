import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";

import Footer from "./Footer";
import LearningMethods from "./LearningMethod";
import Testimonials from "./Testimonials";
import QuizGenerator from "./QuizGenerator";

const Home = () => {
    return (
        <div>
            <Navbar />
            <HeroSection />
            <div className="space-y-12">
                {" "}
                {/* 📌 Điều chỉnh khoảng cách giữa các section */}
                <QuizGenerator />
                <LearningMethods />
                <Testimonials />
            </div>
            <Footer />
        </div>
    );
};

export default Home;
