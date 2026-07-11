import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const SidebarModuleTimeline = ({
    modules,
    selectedModuleId,
    setSelectedModuleId,
    selectedModuleRef,
    nextModule,
    isStartingModule,
    handleStartNextModule,
    getSelectedModuleDetails,
    handlePrevModule,
    handleNextModule
}) => {
    return (
        <Card className="border border-border-light/35 shadow-sm overflow-hidden bg-slate-50/50">
            <CardHeader className="pb-2 border-b border-border-light/20">
                <CardTitle className="text-sm font-bold text-neutral-dark uppercase tracking-wider flex items-center justify-between">
                    <span>Lộ trình học phần</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-extrabold shrink-0">Vuốt & Click</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                
                {/* Navigation controls & Horizontal scrollable selector */}
                <div className="flex items-center gap-1.5">
                    <button
                        onClick={handlePrevModule}
                        disabled={selectedModuleId === 1}
                        className="p-1.5 border border-slate-200 hover:bg-slate-100/80 hover:text-primary rounded-lg text-neutral-medium disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-colors cursor-pointer flex items-center justify-center"
                        title="Học phần trước"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory py-1.5 scrollbar-none scroll-smooth flex-1">
                        {modules.map((m) => {
                            const isCompleted = m.status === "COMPLETED";
                            const isActive = m.status === "ACTIVE";
                            const isSelected = selectedModuleId === m.id;
                            return (
                                <button
                                    key={m.id}
                                    ref={isSelected ? selectedModuleRef : null}
                                    onClick={() => setSelectedModuleId(m.id)}
                                    className={`p-2 border rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer shrink-0 w-24 snap-center ${
                                        isSelected ? "border-primary bg-primary/10 shadow-xs font-bold scale-105" :
                                        isActive ? "border-primary/45 bg-primary/5 hover:bg-primary/10" :
                                        isCompleted ? "border-slate-200 bg-slate-100 hover:bg-slate-200/80" :
                                        "border-slate-100 opacity-60 bg-slate-100/30 hover:opacity-100"
                                    }`}
                                >
                                    <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] mb-1 font-bold ${
                                        isCompleted ? "bg-emerald-100 text-emerald-700" :
                                        isActive ? "bg-primary text-white" :
                                        "bg-slate-200 text-slate-500"
                                    }`}>
                                        {m.id}
                                    </span>
                                    <span className="text-[9px] text-neutral-dark font-bold whitespace-normal wrap-break-word w-full">
                                        Mod {m.id}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleNextModule}
                        disabled={selectedModuleId === modules.length}
                        className="p-1.5 border border-slate-200 hover:bg-slate-100/80 hover:text-primary rounded-lg text-neutral-medium disabled:opacity-30 disabled:cursor-not-allowed shrink-0 transition-colors cursor-pointer flex items-center justify-center"
                        title="Học phần sau"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>

                {/* Syllabus Drill-Down panel for the selected module */}
                {getSelectedModuleDetails() && (() => {
                    const details = getSelectedModuleDetails();
                    const isCompleted = details.status === "COMPLETED";
                    const isActive = details.status === "ACTIVE";
                    const isLocked = details.status === "LOCKED";
                    const isNextToUnlock = details.id === nextModule?.id;

                    return (
                        <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-xs">
                            <div className="flex items-center justify-between gap-2 flex-wrap mb-2">
                                <h4 className="text-xs font-extrabold text-neutral-dark flex-1 wrap-break-word leading-relaxed">{details.title}</h4>
                                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shrink-0 ${
                                    isCompleted ? "bg-emerald-100 text-emerald-700" :
                                    isActive ? "bg-primary/10 text-primary" :
                                    "bg-slate-100 text-slate-500"
                                }`}>
                                    {isCompleted ? "Đã xong" : isActive ? "Đang chạy" : "Khóa"}
                                </span>
                            </div>

                            {isActive && (
                                <div className="mb-3.5">
                                    <div className="flex items-center justify-between text-[9px] font-extrabold text-neutral-medium mb-1">
                                        <span>Hoàn thành lớp</span>
                                        <span>{details.completionRate}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-1">
                                        <div className="h-1 rounded-full bg-primary" style={{ width: `${details.completionRate}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* List of Syllabus Items (with full text, no truncate) */}
                            <div className="space-y-2 mt-2">
                                {details.contents.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-2 bg-slate-50/50 p-2 border border-slate-100 rounded-xl text-xs font-semibold">
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${
                                            item.type === "Bài học" ? "bg-blue-100 text-blue-700" :
                                            item.type === "Thực hành" ? "bg-amber-100 text-amber-700" :
                                            "bg-purple-100 text-purple-700"
                                        }`}>
                                            {item.type}
                                        </span>
                                        <span className="text-neutral-dark flex-1 text-[11px] font-bold wrap-break-word leading-relaxed">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button inside Details Panel if locked and next in line */}
                            {isLocked && isNextToUnlock && (
                                <button
                                    onClick={() => handleStartNextModule(details.id)}
                                    disabled={isStartingModule}
                                    className="w-full mt-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                                >
                                    <Play size={12} />
                                    <span>{isStartingModule ? "Đang xử lý..." : "Kích hoạt Module"}</span>
                                </button>
                            )}
                        </div>
                    );
                })()}

            </CardContent>
        </Card>
    );
};

export default SidebarModuleTimeline;
