import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import ClassPage from "@/modules/course-enrollment/pages/ClassPage";

const ClassView = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col">
      <Header />
      <ClassPage />
      <Footer />
    </div>
  );
};

export default ClassView;
