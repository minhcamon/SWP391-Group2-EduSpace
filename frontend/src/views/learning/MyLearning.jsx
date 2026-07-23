import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { MyLearningPage } from "@/modules/learning";

const MyLearning = () => {
    return (
        <div className="min-h-screen flex flex-col bg-bg-base">
            <Header />
            <div className="grow">
                <MyLearningPage />
            </div>
            <Footer />
        </div>
    );
};

export default MyLearning;
