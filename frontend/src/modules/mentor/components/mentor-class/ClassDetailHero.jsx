import React from "react";
import Badge from "@/components/ui/Badge";

const ClassDetailHero = ({ classDetail, activeModule, totalModules }) => {
    return (
        <div className="bg-blue-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-700/30 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                        {classDetail.name}
                    </h1>
                    <Badge variant="roletag" className="bg-primary/20 text-primary border border-primary/30 text-xs px-3 py-1 font-bold">
                        {classDetail.status}
                    </Badge>
                </div>
                <p className="text-slate-300 text-sm md:text-base mt-2 font-medium">
                    Khóa học chính: <span className="text-white font-bold">{classDetail.courseTitle}</span>
                </p>
            </div>
            <div className="shrink-0 flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-2xl p-4.5 backdrop-blur-md font-mono text-xs">
                <div>
                    <span className="text-slate-400 block mb-0.5">Tiến trình lớp</span>
                    <span className="text-lg font-bold text-white">
                        {activeModule ? `Học phần ${activeModule.id} / ${totalModules}` : "N/A"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailHero;
