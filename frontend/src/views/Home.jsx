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
                <main className="mx-auto w-full px-4 py-12 grow max-w-300">
                    <CourseContainer />
                    {/* <RoadmapContainer /> */}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Home;
