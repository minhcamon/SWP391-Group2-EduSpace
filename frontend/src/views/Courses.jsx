import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ListCoursesView from "@/modules/course-lifecycle/pages/ListCoursesPage";

const Courses = () => {
    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <Header />
            <ListCoursesView />
            <Footer />
        </div>
    );
};

export default Courses;
