import CourseContainer from "@/components/features/course/CourseContainer";
import Header from "@/components/layouts/Header";
import RoadmapContainer from "@/components/features/roadmap/RoadmapContainer";
import Footer from "@/components/layouts/Footer";

const HomePage = () => {
    return (
        <>
            <div>
                <Header />
                <div className="min-h-screen">
                    <RoadmapContainer />
                    <CourseContainer />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default HomePage;
