import React from "react";
import Sidebar from "@/components/layouts/Sidebar";
import CourseDetailView from "@/modules/course-lifecycle/pages/CourseDetailPage";

const CourseDetail = () => {
    return (
        <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 p-8 bg-bg-base overflow-y-auto">
                    <CourseDetailView />
                </main>
            </div>
        </div>
    );
};

export default CourseDetail;
