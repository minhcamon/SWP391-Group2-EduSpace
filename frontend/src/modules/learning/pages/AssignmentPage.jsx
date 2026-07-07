import React from "react";
import { Clock, Lock } from "lucide-react";
import useAssignment from "../hooks/useAssignment";
import Badge from "@/components/ui/Badge";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import AssignmentWork from "../components/AssignmentWork";
import ResultReview from "../components/ResultReview";

export const AssignmentPage = () => {
  const {
    classId,
    activeTab,
    setActiveTab,
    isLoading,
    assignmentDetails,
    essay,
    wordCount,
    isSubmitting,
    isSubmitted,
    partner,
    comments,
    newCommentText,
    setNewCommentText,
    newCommentCategory,
    setNewCommentCategory,
    timeRemaining,
    handleEssayChange,
    handleSubmitDraft,
    handleAddComment,
    rubricCriteria,
    estimatedBand,
    partnerSubmission
  } = useAssignment();

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-medium">
            Đang tải thông tin bài tập...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="grow w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-6">
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs
        items={[
          { label: "Khóa học", to: "/courses" },
          { label: "Lớp học", to: `/classes/${classId}` },
          { label: assignmentDetails?.title || "Bài tập" }
        ]}
        className="mb-2"
      />

      {/* Title & Info Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light/25 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              IELTS Writing Task 2
            </span>
            <span className="text-xs text-neutral-medium font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" /> {timeRemaining} phút còn lại
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
            {assignmentDetails?.title}
          </h1>
          <p className="text-sm text-neutral-medium mt-1">
            Luyện tập viết luận và thực hiện đánh giá chéo cùng bạn học trong nhóm.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="roletag" className="py-1.5 px-4 rounded-full text-xs font-bold">
            Trạng thái: {isSubmitted ? "Đã nộp bài" : "Đang thực hiện"}
          </Badge>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-border-light/35">
        <button
          onClick={() => setActiveTab("assignment")}
          className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === "assignment"
              ? "border-primary text-primary font-bold"
              : "border-transparent text-neutral-medium hover:text-primary"
          }`}
        >
          1. Bài tập luận
        </button>
        <button
          disabled={!isSubmitted}
          onClick={() => isSubmitted && setActiveTab("review")}
          title={!isSubmitted ? "Vui lòng nộp bài viết trước để mở khóa đánh giá chéo" : ""}
          className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
            !isSubmitted
              ? "border-transparent text-neutral-medium/50 cursor-not-allowed"
              : activeTab === "review"
              ? "border-primary text-primary font-bold cursor-pointer"
              : "border-transparent text-neutral-medium hover:text-primary cursor-pointer"
          }`}
        >
          {!isSubmitted && <Lock className="w-3.5 h-3.5 text-neutral-medium/40" />}
          2. Đối chiếu & Đánh giá chéo
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="grow">
        {activeTab === "assignment" ? (
          <AssignmentWork
            assignmentDetails={assignmentDetails}
            essay={essay}
            handleEssayChange={handleEssayChange}
            isSubmitted={isSubmitted}
            wordCount={wordCount}
            handleSubmitDraft={handleSubmitDraft}
            isSubmitting={isSubmitting}
            partner={partner}
            timeRemaining={timeRemaining}
          />
        ) : (
          <ResultReview
            partnerSubmission={partnerSubmission}
            rubricCriteria={rubricCriteria}
            estimatedBand={estimatedBand}
            comments={comments}
            newCommentText={newCommentText}
            setNewCommentText={setNewCommentText}
            newCommentCategory={newCommentCategory}
            setNewCommentCategory={setNewCommentCategory}
            handleAddComment={handleAddComment}
          />
        )}
      </div>
    </main>
  );
};

export default AssignmentPage;
