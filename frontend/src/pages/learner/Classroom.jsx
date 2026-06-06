import React from "react";
import Sidebar from "@/components/layouts/Sidebar";
import ClassroomView from "@/modules/class/pages/ClassroomPage";

const Classroom = () => {
    return (
        <div className="flex w-full min-h-screen bg-bg-base text-neutral-dark">
            <Sidebar />
            <main className="grow p-8">
                <ClassroomView />
            </main>
        </div>
    );
};

export default Classroom;
