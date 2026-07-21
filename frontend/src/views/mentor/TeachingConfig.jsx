import React from "react";
import { TeachingConfigPage, MentorHeader } from "@/modules/mentor";

const TeachingConfig = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <TeachingConfigPage />
      </main>
    </div>
  );
};

export default TeachingConfig;
