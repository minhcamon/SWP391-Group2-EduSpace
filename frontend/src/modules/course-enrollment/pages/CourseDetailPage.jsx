import React from "react";
import { useParams, Link } from "react-router";
import { useCourseEnrollment } from "../hooks/useCourseEnrollment";
import SyllabusAccordion from "../components/SyllabusAccordion";
import EnrollmentSidebar from "../components/EnrollmentSidebar";
import { BookOpen, Clock, Award } from "lucide-react";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export const CourseDetailPage = () => {
  const { id } = useParams();
  const { course, isLoading, error, isEnrolled, joinCourse } = useCourseEnrollment(id);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-medium">Đang tải thông tin khóa học...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[500px] px-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-border-light/40 shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-danger mb-2">Đã xảy ra lỗi</h2>
          <p className="text-sm text-neutral-medium mb-6">
            {error || "Không thể tìm thấy thông tin khóa học."}
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

  return (
    <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Khóa học", to: "/courses" },
          { label: course.title, className: "text-neutral-dark" }
        ]}
        className="mb-6"
      />

      {/* 7:3 Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column (70%) */}
        <div className="lg:w-[70%] flex flex-col gap-8">
          {/* Hero Header */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-dark tracking-tight">
              {course.title}
            </h1>
            <p className="text-base md:text-lg text-neutral-medium leading-relaxed max-w-3xl">
              {course.description}
            </p>

            {/* Badges / Info chips */}
            <div className="flex flex-wrap gap-2.5 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                {course.format || "Học theo cặp"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-card border border-border-light/25 text-neutral-medium text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                Thời gian: {course.duration || "6 tuần"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-card border border-border-light/25 text-neutral-medium text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                Trình độ: {course.level || "Intermediate"}
              </span>
            </div>
          </div>

          {/* Banner Image */}
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm relative">
            <img
              alt={course.title}
              className="w-full h-full object-cover"
              src={course.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c"}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Syllabus Section */}
          <div className="mt-2">
            <SyllabusAccordion syllabus={course.modules} />
          </div>
        </div>

        {/* Right Column (30%) */}
        <div className="lg:w-[30%]">
          <EnrollmentSidebar
            currentStudents={course.currentStudents}
            maxStudents={course.maxStudents}
            onEnroll={joinCourse}
            isEnrolled={isEnrolled}
          />
        </div>
      </div>
    </main>
  );
};

export default CourseDetailPage;
