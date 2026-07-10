import React from "react";
import { ArbitrationDetailPage, MentorHeader } from "@/modules/mentor";

const ArbitrationDetailView = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <ArbitrationDetailPage />
      </main>
    </div>
  );
};

export default ArbitrationDetailView;
