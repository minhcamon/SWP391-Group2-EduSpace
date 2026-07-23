import Sidebar from "@/components/layouts/Sidebar";
import CoursePage from "@/modules/admin/pages/CoursePage";

const Courses = () => {
    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-4 md:p-8 min-w-0 space-y-8">
                <CoursePage />
            </main>
        </div>
    );
};

export default Courses;
