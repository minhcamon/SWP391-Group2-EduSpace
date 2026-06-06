import React from "react";
import Sidebar from "@/components/layouts/Sidebar";

const Dashboard = () => {
    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <h1 className="text-2xl font-bold text-neutral-dark">Admin Dashboard</h1>
                <p className="text-sm text-neutral-medium">Chào mừng đến với hệ thống quản trị EduSpace.</p>
            </main>
        </div>
    );
};

export default Dashboard;
