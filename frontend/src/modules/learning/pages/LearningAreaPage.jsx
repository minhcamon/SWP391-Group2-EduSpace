import React from "react";
import { ArrowLeft, Menu, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "../components/VideoPlayer";
import PairChat from "../components/PairChat";
import CourseSidebar from "../components/CourseSidebar";
import useLearningArea from "../hooks/useLearningArea";
import Badge from "@/components/ui/Badge";

const LearningAreaPage = () => {
    const {
        isSidebarOpen,
        setIsSidebarOpen,
        activeTab,
        setActiveTab,
        isSynced,
        setIsSynced,
        isPlaying,
        setIsPlaying,
        isCompleted,
        messages,
        inputText,
        setInputText,
        sharedNotes,
        setSharedNotes,
        materials,
        handleSendMessage,
        handleMarkCompleted,
        handleExit,
        isLoading,
        courseTitle,
        studyGroup,
        lesson,
        sidebarSections
    } = useLearningArea();

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-bg-base">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-neutral-medium">Đang tải dữ liệu EduSpace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-bg-base text-neutral-dark">
            {/* Header Area */}
            <header className="bg-white border-b border-border-light shrink-0 z-30 h-16 flex items-center justify-between px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleExit}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all cursor-pointer font-semibold"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-sm hidden md:inline">Thoát bài học</span>
                    </button>
                    <div className="h-6 w-px bg-border-light mx-2 hidden md:block"></div>
                    <h1 className="text-lg font-bold text-neutral-dark truncate max-w-[200px] sm:max-w-md">
                        {courseTitle}
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Study Group Section */}
                    {studyGroup && studyGroup.length > 0 && (
                        <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 bg-sky-50 rounded-full border border-sky-100">
                            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                                Nhóm Học
                            </span>
                            <div className="flex -space-x-2">
                                {studyGroup.map((member) => (
                                    <div key={member.id} className="relative">
                                        {member.avatar ? (
                                            <img
                                                alt={member.name}
                                                className="w-7 h-7 rounded-full ring-2 ring-white object-cover"
                                                src={member.avatar}
                                            />
                                        ) : (
                                            <div className={`w-7 h-7 rounded-full ${member.bgColor || "bg-slate-100"} ${member.textColor || "text-neutral-medium"} flex items-center justify-center ring-2 ring-white text-[10px] font-bold`}>
                                                {member.initials}
                                            </div>
                                        )}
                                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                            member.status === "online" 
                                                ? "bg-green-500" 
                                                : member.status === "idle" 
                                                    ? "bg-yellow-400" 
                                                    : "bg-slate-400"
                                        }`}></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-3">
                        <span className="text-xs font-semibold text-neutral-medium">Tiến độ</span>
                        <Badge variant={isCompleted ? "approved" : "secondary"}>
                            {isCompleted ? "100% Hoàn thành" : "60% Hoàn thành"}
                        </Badge>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="md:hidden p-1.5 rounded-lg hover:bg-hover-light transition-all text-neutral-medium hover:text-primary cursor-pointer"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </header>

      {/* Main Layout Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Content Area (Video & Tabs) */}
        <div className="grow flex flex-col md:w-[70%] overflow-y-auto min-w-0 bg-white">
          <div className="max-w-4xl mx-auto py-6 px-4 md:px-8 w-full flex flex-col gap-6">
            <VideoPlayer
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              isSynced={isSynced}
              onToggleSync={() => setIsSynced(!isSynced)}
              lesson={lesson}
            />

            {/* Lesson Title & Desc */}
            {lesson && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="bg-sky-50 text-primary border border-sky-100 px-2 py-0.5 rounded text-xs font-bold">
                    {lesson.module}
                  </span>
                  <span className="text-neutral-light text-xs font-semibold flex items-center gap-1">
                    <Clock size={14} /> {lesson.duration}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-dark">
                  {lesson.title}
                </h2>
                <p className="text-neutral-medium text-sm leading-relaxed max-w-3xl">
                  {lesson.description}
                </p>
              </div>
            )}

            <PairChat
              activeTab={activeTab}
              onTabChange={setActiveTab}
              messages={messages}
              inputText={inputText}
              onInputChange={(e) => setInputText(e.target.value)}
              onSubmitMessage={handleSendMessage}
              sharedNotes={sharedNotes}
              onNotesChange={(e) => setSharedNotes(e.target.value)}
              materials={materials}
              onDownloadMaterial={(file) => toast.success(`Đang tải file ${file.name}`)}
            />

            {/* Mark completed block */}
            <div className="mt-6 py-6 border-t border-border-light flex flex-col items-center gap-4 text-center">
              <div className="max-w-md">
                <p className="text-sm text-neutral-medium mb-4">
                  Bạn và nhóm của mình đã hoàn thành buổi học này chứ? Đánh dấu hoàn thành để cập nhật tiến độ sang bài tiếp theo.
                </p>
                <button
                  onClick={handleMarkCompleted}
                  disabled={isCompleted}
                  className={`w-full py-3.5 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${isCompleted
                      ? "bg-slate-100 text-neutral-light cursor-not-allowed border border-slate-200"
                      : "bg-secondary text-white hover:shadow-md hover:bg-secondary/90 hover:scale-[1.01]"
                    }`}
                >
                  <CheckCircle size={18} />
                  {isCompleted ? "Bài học đã hoàn thành" : "Đánh dấu hoàn thành bài học"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <CourseSidebar
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          isCompleted={isCompleted}
          sidebarSections={sidebarSections}
        />
      </main>
    </div>
  );
};

export default LearningAreaPage;
