import Sidebar from "@/components/layouts/Sidebar";
import CoursesPage from "@/modules/admin/pages/CoursesPage";

const Courses = () => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <CoursesPage />
            </main>
        </div>
    );
};

export default Courses;
