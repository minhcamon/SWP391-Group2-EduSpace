import React from "react";
import { useNavigate } from "react-router";
import {
    Target,
    Hand,
    Check,
    Lock,
    Eye,
    RefreshCw
} from "lucide-react";
import useProgressDashboard from "../hooks/useProgressDashboard";

const ProgressDashboardPage = () => {
    const navigate = useNavigate();
    const {
        isLoading,
        partner,
        progress,
        roadmap,
        handleSayHi,
        courseId
    } = useProgressDashboard();

    const handleContinueLearning = () => {
        navigate(`/courses/${courseId || 1}/learn`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-bg-base">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-neutral-medium">Đang tải tiến độ học tập...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-base text-neutral-dark py-8 px-4 sm:px-6 md:px-10">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-3 space-y-6">
                        {/* My Partner Card */}
                        {partner && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light/35 flex flex-col items-center text-center space-y-4">
                                <h2 className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Bạn đồng hành của bạn
                                </h2>
                                
                                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow-sm shrink-0">
                                    <img
                                        alt="Partner avatar"
                                        className="w-full h-full object-cover"
                                        src={partner.avatar}
                                    />
                                    <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-neutral-dark">{partner.name}</h3>
                                    <p className="text-xs text-neutral-medium flex items-center justify-center gap-1 mt-1">
                                        <Target size={14} className="text-primary" />
                                        Mục tiêu: {partner.goal}
                                    </p>
                                </div>

                                <button
                                    onClick={handleSayHi}
                                    className="w-full mt-2 bg-secondary/10 hover:bg-secondary/20 text-secondary font-bold text-sm py-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer"
                                >
                                    <Hand size={16} />
                                    Say Hi
                                </button>
                            </div>
                        )}

                        {/* Course Progress Summary Card */}
                        {progress && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-light/35 space-y-4">
                                <h3 className="text-xs font-bold text-neutral-medium uppercase tracking-wider">
                                    Khóa học hiện tại
                                </h3>
                                <p className="text-sm font-bold text-neutral-dark">
                                    {progress.title}
                                </p>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-secondary rounded-full transition-all duration-500"
                                        style={{ width: `${progress.percent}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-neutral-light font-semibold">
                                    <span>Tiến độ: {progress.percent}%</span>
                                    <span>Bài {progress.currentLesson}/{progress.totalLessons}</span>
                                </div>
                            </div>
                        )}
                    </aside>

                    {/* Main Timeline Column */}
                    <section className="lg:col-span-7">
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border-light/35">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-100 pb-4">
                                <h1 className="text-xl font-bold text-neutral-dark">Lộ trình học tập</h1>
                                <span className="px-3 py-1 bg-sky-50 text-primary rounded-full text-xs font-bold border border-sky-100 flex items-center gap-1.5">
                                    <RefreshCw size={12} className="animate-spin-slow" />
                                    Đồng bộ với đối tác
                                </span>
                            </div>

                            {/* Linear Timeline Map */}
                            <div className="relative pl-8">
                                {/* Vertical Connecting line */}
                                <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-200 rounded-full"></div>

                                {/* Active Progress Highlight overlay */}
                                <div className="absolute left-[15px] top-3 h-[40%] w-0.5 bg-primary rounded-full"></div>

                                <div className="space-y-8 relative">
                                    {roadmap.map((node) => {
                                        if (node.status === "COMPLETED") {
                                            return (
                                                <div key={node.id} className="relative flex gap-6 group">
                                                    <div className="absolute left-[-31px] w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center border-4 border-white z-10 shadow-sm shrink-0">
                                                        <Check size={12} strokeWidth={3} />
                                                    </div>
                                                    <div className="grow bg-slate-50/50 hover:bg-slate-50 p-5 rounded-xl border border-border-light/20 hover:shadow-sm transition-all cursor-pointer">
                                                        <div className="flex justify-between items-start mb-1.5">
                                                            <span className="text-xs font-bold text-primary uppercase">Bài {node.step}</span>
                                                            <span className="text-xs text-neutral-light font-semibold">Đã hoàn thành</span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-neutral-dark mb-1">
                                                            {node.title}
                                                        </h4>
                                                        <p className="text-xs text-neutral-medium leading-relaxed">
                                                            {node.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (node.status === "CURRENT") {
                                            return (
                                                <div key={node.id} className="relative flex gap-6 group">
                                                    <div className="absolute left-[-35px] w-8 h-8 rounded-full bg-white border-4 border-primary flex items-center justify-center z-10 shadow-md shrink-0">
                                                        <div className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></div>
                                                    </div>
                                                    {/* Learner Avatar on Left */}
                                                    <div className="absolute left-[-85px] top-1 flex flex-col items-center">
                                                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary shadow-sm bg-slate-100 shrink-0">
                                                            <img
                                                                alt="Your avatar"
                                                                className="w-full h-full object-cover"
                                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-primary mt-1">Bạn</span>
                                                    </div>

                                                    <div className="grow bg-sky-50/70 p-5 rounded-xl border border-sky-100 shadow-sm transition-all">
                                                        <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                                                            <span className="text-xs font-bold text-primary uppercase">
                                                                Bài {node.step} (Hiện tại)
                                                            </span>
                                                            <button
                                                                onClick={handleContinueLearning}
                                                                className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                                                            >
                                                                Tiếp tục học
                                                            </button>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-neutral-dark mb-1">
                                                            {node.title}
                                                        </h4>
                                                        <p className="text-xs text-neutral-medium leading-relaxed">
                                                            {node.description}
                                                        </p>
                                                        {/* Embedded progress */}
                                                        <div className="mt-3.5 flex items-center gap-3">
                                                            <div className="grow h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-secondary rounded-full"
                                                                    style={{ width: `${node.progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-bold text-secondary">{node.progress}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        if (node.status === "PARTNER_CURRENT") {
                                            return (
                                                <div key={node.id} className="relative flex gap-6 group">
                                                    <div className="absolute left-[-29px] w-5 h-5 rounded-full bg-slate-200 text-neutral-light flex items-center justify-center border-2 border-white z-10 shrink-0">
                                                        <Lock size={10} />
                                                    </div>
                                                    {/* Partner Avatar on Left */}
                                                    <div className="absolute left-[-85px] top-1 flex flex-col items-center">
                                                        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-secondary/70 shadow-sm shrink-0">
                                                            <img
                                                                alt="Partner avatar small"
                                                                className="w-full h-full object-cover"
                                                                src={partner.avatar}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-secondary mt-1">
                                                            {partner.name ? partner.name.split(" ").pop() : "Đối tác"}
                                                        </span>
                                                    </div>

                                                    <div className="grow bg-white p-5 rounded-xl border border-slate-200/80 transition-all">
                                                        <div className="flex justify-between items-start mb-1.5">
                                                            <span className="text-xs font-bold text-neutral-light uppercase">Bài {node.step}</span>
                                                            <span className="text-[10px] font-bold text-primary bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                                                <Eye size={12} />
                                                                Đối tác đang học
                                                            </span>
                                                        </div>
                                                        <h4 className="text-sm font-bold text-neutral-dark mb-1">
                                                            {node.title}
                                                        </h4>
                                                        <p className="text-xs text-neutral-medium leading-relaxed">
                                                            {node.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // Default: LOCKED node
                                        return (
                                            <div key={node.id} className="relative flex gap-6 group opacity-65">
                                                <div className="absolute left-[-29px] w-5 h-5 rounded-full bg-slate-200 text-neutral-light flex items-center justify-center border-2 border-white z-10 shrink-0">
                                                    <Lock size={10} />
                                                </div>
                                                <div className="grow bg-slate-50/30 p-5 rounded-xl border border-slate-100 transition-all">
                                                    <div className="mb-1.5">
                                                        <span className="text-xs font-bold text-neutral-light uppercase">Bài {node.step}</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-neutral-medium mb-1">
                                                        {node.title}
                                                    </h4>
                                                    <p className="text-xs text-neutral-light leading-relaxed">
                                                        {node.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ProgressDashboardPage;
