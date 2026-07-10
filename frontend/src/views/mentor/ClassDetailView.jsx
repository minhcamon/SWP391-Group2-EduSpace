import React from "react";
import { ClassDetailPage, MentorHeader } from "@/modules/mentor";

const ClassDetailView = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <ClassDetailPage />
      </main>
    </div>
  );
};

export default ClassDetailView;
