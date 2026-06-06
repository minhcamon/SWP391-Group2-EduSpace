import React from "react";
import Sidebar from "@/components/layouts/Sidebar";
import PairWorkspaceView from "@/modules/class/pages/PairWorkspacePage";

const PairWorkspace = () => {
    return (
        <div className="flex w-full min-h-screen bg-bg-base text-neutral-dark">
            <Sidebar />
            <main className="grow p-8">
                <PairWorkspaceView />
            </main>
        </div>
    );
};

export default PairWorkspace;
