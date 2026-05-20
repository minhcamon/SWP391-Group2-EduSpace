import CourseContainer from "@/components/features/course/CourseContainer";
import Header from "@/components/layouts/Header";
import RoadmapContainer from "@/components/features/roadmap/RoadmapContainer";

const HomePage = () => {
    return (
        <>
            <div>
                <Header />
                <RoadmapContainer />
                <CourseContainer />
            </div>
        </>
    );
};

export default HomePage;
