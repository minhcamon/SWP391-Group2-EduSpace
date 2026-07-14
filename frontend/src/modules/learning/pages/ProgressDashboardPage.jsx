import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import useProgressDashboard from "../hooks/useProgressDashboard";
import PartnerCard from "../components/PartnerCard";
import SidebarModulesList from "../components/SidebarModulesList";
import CurrentModuleFocus from "../components/CurrentModuleFocus";

const ProgressDashboardPage = () => {
  const navigate = useNavigate();
  const { isLoading, partner, modules, currentModule, handleSayHi, courseId, classId } =
    useProgressDashboard();

  const handleContinueLearning = () => {
    navigate(`/courses/${courseId || 1}/learn`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-neutral-medium">
            Đang tải tiến độ học tập...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-350 mx-auto bg-bg-base text-neutral-dark py-8 px-4 sm:px-6 md:px-10 transition-colors duration-300">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-border-light/25">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-dark">Tiến trình học tập</h1>
          <p className="text-xs text-neutral-medium mt-1">
            Theo dõi lộ trình bài học và hoạt động học tập nhóm
          </p>
        </div>
        {classId && (
          <button
            onClick={() => navigate(`/classes/${classId}`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold rounded-xl border border-primary/20 cursor-pointer shadow-xs transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={14} />
            Quay về lớp học hiện tại
          </button>
        )}
      </div>

      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
            {/* My Partner Card */}
            <PartnerCard partner={partner} handleSayHi={handleSayHi} />

            {/* Module Status List (All Modules) */}
            <SidebarModulesList modules={modules} />
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-7">
            <CurrentModuleFocus
              currentModule={currentModule}
              partner={partner}
              handleContinueLearning={handleContinueLearning}
              classId={classId}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboardPage;
