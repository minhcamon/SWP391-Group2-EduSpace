import React from "react";
import Herobar from "../components/Herobar";
import CourseContainer from "../components/CourseContainer";
import Header from "../components/common/Header";
import { Sidebar } from "../components/common/Sidebar";

const HomePage = () => {
    return (
        <>
            <div className="flex mt-4">
                <div>
                    <Sidebar />
                </div>
                <div>
                    <Header />
                    <Herobar />
                    <CourseContainer />
                </div>
            </div>
        </>
    );
};

export default HomePage;
