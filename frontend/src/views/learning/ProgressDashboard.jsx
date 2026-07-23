import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { ProgressDashboardPage } from "@/modules/learning";

const ProgressDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-bg-base">
            <Header />
            <div className="grow">
                <ProgressDashboardPage />
            </div>
            <Footer />
        </div>
    );
};

export default ProgressDashboard;
