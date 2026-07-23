import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ListCoursesView from "@/modules/course-lifecycle/pages/ListCoursesPage";

const Courses = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <Header />
            <main className="mx-auto w-full px-4 py-12 grow max-w-300">
                <ListCoursesView />
            </main>
            <Footer />
        </div>
    );
};

export default Courses;
