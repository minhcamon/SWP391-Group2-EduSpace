import React from "react";
import { Plus } from "lucide-react";
import useMentorDashboard from "../hooks/useMentorDashboard";
import MentorClassCard from "../components/MentorClassCard";
import MentorToolCard from "../components/MentorToolCard";
import { mockMentorTools } from "../utils/mockData";
import Button from "@/components/ui/Button";

import EmptyState from "@/components/ui/EmptyState";
import { GraduationCap } from "lucide-react";

export const MentorDashboardPage = () => {
  const {
    classes,
    isLoading,
    isSubmitting,
    handleStartClass
  } = useMentorDashboard();

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-medium">
            Đang tải dữ liệu Mentor...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-w-screen mx-auto px-4 md:px-8 py-8 grow">
      {/* Header Section */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Mentor Dashboard
          </h1>
          <p className="text-sm text-neutral-medium mt-1">
            Chào buổi sáng, Mentor. Đây là tổng quan các lớp học bạn đang phụ trách.
          </p>
        </div>
      </div>

      {/* Course Cards Grid */}
      {classes.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="Không tìm thấy lớp học"
          description="Bạn hiện tại chưa được phân công làm Mentor cho bất kỳ lớp học nào."
          className="my-8"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <MentorClassCard key={classItem.id} classItem={classItem} />
          ))}
        </div>
      )}

      {/* Secondary Mentor Tools */}
      <section className="mt-10">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-medium mb-4">
          Công cụ hỗ trợ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockMentorTools.map((tool) => (
            <MentorToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default MentorDashboardPage;
