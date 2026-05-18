import CourseContainer from "../components/course/CourseContainer";
import Header from "../components/common/Header";
import RoadmapContainer from "../components/roadmap/RoadmapContainer";

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
