import React from "react";
import { ClassManagementPage, MentorHeader } from "@/modules/mentor";

const Classes = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <ClassManagementPage />
      </main>
    </div>
  );
};

export default Classes;
