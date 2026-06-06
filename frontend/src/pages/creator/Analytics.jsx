import React from "react";
import Sidebar from "@/components/layouts/Sidebar";
import CreatorAnalyticsView from "@/modules/course-lifecycle/pages/CreatorAnalyticsPage";

const Analytics = () => {
    return (
        <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-8 bg-bg-base overflow-y-auto">
                    <CreatorAnalyticsView />
                </main>
            </div>
        </div>
    );
};

export default Analytics;
