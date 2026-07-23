import React from "react";
import { MentorDashboardPage, MentorHeader } from "@/modules/mentor";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <MentorHeader />
      <main className="grow flex flex-col">
        <MentorDashboardPage />
      </main>
    </div>
  );
};

export default Dashboard;
