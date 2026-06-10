import React from "react";
import CourseContainer from "@/modules/course-lifecycle/components/CourseContainer";
import Header from "@/components/layouts/Header";
import RoadmapContainer from "@/modules/roadmap/components/RoadmapContainer";
import Footer from "@/components/layouts/Footer";

const Home = () => {
    return (
        <>
            <div className="min-h-screen w-full bg-gray-50 flex flex-col">
                <Header />
                <main className="w-full mx-auto py-12 grow container">
                    <CourseContainer />
                    <RoadmapContainer />
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Home;
