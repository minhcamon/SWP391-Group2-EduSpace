import React from "react";
import { IncidentDetailPage, MentorHeader } from "@/modules/mentor";

const IncidentDetailView = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <IncidentDetailPage />
      </main>
    </div>
  );
};

export default IncidentDetailView;
