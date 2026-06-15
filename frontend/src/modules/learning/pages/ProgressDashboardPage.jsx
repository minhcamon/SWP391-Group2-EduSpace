import React from "react";
import { useNavigate } from "react-router";
import useProgressDashboard from "../hooks/useProgressDashboard";
import PartnerCard from "../components/PartnerCard";
import SidebarModulesList from "../components/SidebarModulesList";
import CurrentModuleFocus from "../components/CurrentModuleFocus";

const ProgressDashboardPage = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    partner,
    modules,
    currentModule,
    handleSayHi,
    courseId
  } = useProgressDashboard();

  const handleContinueLearning = () => {
    navigate(`/courses/${courseId || 1}/learn`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-neutral-medium">Đang tải tiến độ học tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-350 mx-auto bg-bg-base text-neutral-dark py-8 px-4 sm:px-6 md:px-10 transition-colors duration-300">
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
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboardPage;
