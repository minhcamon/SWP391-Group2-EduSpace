import CourseContainer from "@/modules/course-lifecycle/components/CourseContainer";
import MyLearningContainer from "@/modules/learning/components/MyLearningContainer";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const Home = () => {
    return (
        <>
            <div className="min-h-screen w-full bg-gray-50 flex flex-col">
                <Header />
                <main className="mx-auto w-full px-4 py-12 grow max-w-300 space-y-12">
                    <CourseContainer />
                    <MyLearningContainer />
                    {/* <RoadmapContainer /> */}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default Home;
