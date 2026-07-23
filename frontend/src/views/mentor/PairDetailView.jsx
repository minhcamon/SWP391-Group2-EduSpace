import React from "react";
import { PairDetailPage, MentorHeader } from "@/modules/mentor";

const PairDetailView = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <PairDetailPage />
      </main>
    </div>
  );
};

export default PairDetailView;
