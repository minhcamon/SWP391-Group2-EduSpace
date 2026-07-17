import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import { MyIncidentsPage } from "@/modules/learning";

const MyIncidents = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-base">
      <Header />
      <div className="grow flex">
        <MyIncidentsPage />
      </div>
    </div>
  );
};

export default MyIncidents;
