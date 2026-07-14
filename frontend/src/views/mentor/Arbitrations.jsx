import React from "react";
import { ArbitrationsPage, MentorHeader } from "@/modules/mentor";

const Arbitrations = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <ArbitrationsPage />
      </main>
    </div>
  );
};

export default Arbitrations;
