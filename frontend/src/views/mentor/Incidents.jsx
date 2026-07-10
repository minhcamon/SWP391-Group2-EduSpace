import React from "react";
import { IncidentsPage, MentorHeader } from "@/modules/mentor";

const Incidents = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <IncidentsPage />
      </main>
    </div>
  );
};

export default Incidents;
