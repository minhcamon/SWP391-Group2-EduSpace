import React from "react";
import CourseContainer from "@/modules/course-lifecycle/components/CourseContainer";
import Header from "@/components/layouts/Header";
import RoadmapContainer from "@/modules/roadmap/components/RoadmapContainer";
import Footer from "@/components/layouts/Footer";

const Home = () => {
    return (
        <>
            <div>
                <Header />
                <div className="min-h-screen">
                    <CourseContainer />
                    <RoadmapContainer />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default Home;
