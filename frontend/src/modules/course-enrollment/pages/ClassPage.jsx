import React from "react";
import { useParams, Link } from "react-router";
import { useClassDetails } from "../hooks/useClassDetails";
import PreCourseMaterials from "../components/PreCourseMaterials";
import ClassStatusSidebar from "../components/ClassStatusSidebar";
import ClassFeed from "../components/ClassFeed";
import ClassPersonnel from "../components/ClassPersonnel";
import { MessageSquare, Bell, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Breadcrumbs from "@/components/common/Breadcrumbs";
export const ClassPage = () => {
  const { classId } = useParams();
  const {
    classData,
    isLoading,
    error,
    addReaction,
    cancelSearch,
    findStudyBuddy,
  } = useClassDetails(classId);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-medium">
            Đang tải thông tin lớp học...
          </span>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[500px] px-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-border-light/40 shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-danger mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-sm text-neutral-medium mb-6">
            {error || "Không thể tìm thấy thông tin lớp học."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/95 transition-colors"
          >
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  const isWaitlist = classData.status === "WAITING";

  return (
    <main className="flex-grow flex flex-col w-full">
      {/* Top Banner (Only for WAITING / Waitlist state) */}
      {isWaitlist && (
        <div className="bg-primary/10 border-b border-primary/15 py-4 px-4 md:px-8">
          <div className="max-w-[1280px] mx-auto flex items-start gap-3 text-primary text-sm font-medium">
            <span className="text-lg leading-none mt-0.5">✉️</span>
            <p className="leading-relaxed">
              {classData.bannerMessage ||
                "Lớp học đang được thiết lập. Hệ thống sẽ tự động ghép cặp ngay khi đủ người..."}
            </p>
          </div>
        </div>
      )}



      {/* Main Section */}
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-8 py-8 flex-grow">
        <Breadcrumbs items={[
          { label: "Khóa học", to: "/courses" },
          { label: "Lớp học", to: `/courses/${classData.courseId}` },
          { label: classData.cohortName }
        ]}
          className="mb-4"
        />
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-1.5">
              Bảng tin Lớp học
            </h1>
            <p className="text-sm text-neutral-medium">
              Cập nhật các hoạt động mới nhất của{" "}
              {classData.cohortName || "Lớp học"}.
            </p>
          </div>

          {isWaitlist ? (
            <Button
              onClick={cancelSearch}
              variant="outline"
              className="text-neutral-medium border-border-light/60 hover:bg-bg-card hover:text-neutral-dark rounded-full px-5 py-2 text-xs font-semibold self-start"
            >
              Hủy tìm kiếm
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Extra visual indicators for active class page header */}
              <Badge variant="roletag" className="py-1 px-3">
                Lớp hoạt động
              </Badge>
            </div>
          )}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main content column (70%) */}
          <div className="lg:col-span-7">
            {isWaitlist ? (
              <PreCourseMaterials
                materials={classData.preCourseMaterials}
              />
            ) : (
              <ClassFeed
                feed={classData.activeFeed}
                onReactionClick={addReaction}
              />
            )}
          </div>

          {/* Sidebar column (30%) */}
          <div className="lg:col-span-3">
            {isWaitlist ? (
              <ClassStatusSidebar
                currentStudents={classData.currentStudents}
                maxStudents={classData.maxStudents}
                members={classData.membersWaiting}
              />
            ) : (
              <ClassPersonnel
                pairs={classData.activePersonnel}
                onFindBuddy={findStudyBuddy}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClassPage;
