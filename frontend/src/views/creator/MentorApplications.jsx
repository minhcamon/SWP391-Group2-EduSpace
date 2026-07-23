import Sidebar from "@/components/layouts/Sidebar";
import MentorApplicationsPage from "@/modules/course-lifecycle/pages/MentorApplicationsPage";

const MentorApplications = () => {
    return (
        <div className="bg-bg-base text-neutral-dark min-h-screen font-sans antialiased">
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                <main className="flex-1 p-4 md:p-8 bg-bg-base overflow-y-auto">
                    <MentorApplicationsPage />
                </main>
            </div>
        </div>
    );
};

export default MentorApplications;
