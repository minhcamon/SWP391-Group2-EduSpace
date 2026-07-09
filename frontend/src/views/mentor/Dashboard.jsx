import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { MentorDashboardPage } from "@/modules/mentor";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-bg-base flex flex-col font-sans">
      <Header />
      <main className="grow flex flex-col">
        <MentorDashboardPage />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
