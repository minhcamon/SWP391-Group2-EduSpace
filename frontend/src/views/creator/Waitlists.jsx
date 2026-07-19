import React from "react";
import Sidebar from "@/components/layouts/Sidebar";
import CreatorWaitlistView from "@/modules/course-lifecycle/pages/CreatorWaitlistPage";

const Waitlists = () => {
    return (
        <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                <main className="flex-1 p-4 md:p-8 bg-bg-base overflow-y-auto">
                    <CreatorWaitlistView />
                </main>
            </div>
        </div>
    );
};

export default Waitlists;
