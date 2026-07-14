import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import CourseDetailPage from "@/modules/course-enrollment/pages/CourseDetailPage";

const LearnerCourseDetail = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col">
      <Header />
      <CourseDetailPage />
      <Footer />
    </div>
  );
};

export default LearnerCourseDetail;
