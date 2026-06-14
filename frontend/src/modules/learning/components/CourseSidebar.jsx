import React from "react";
import { X, CheckCircle, PlayCircle, Lock } from "lucide-react";

const CourseSidebar = ({ isSidebarOpen, onCloseSidebar, isCompleted, sidebarSections }) => {
    return (
        <aside
            className={`absolute md:relative top-0 right-0 h-full w-[280px] sm:w-[320px] bg-bg-sidebar border-l border-border-light flex flex-col z-40 transition-transform duration-300 ${
                isSidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
            }`}
        >
            <div className="p-4 border-b border-border-light flex items-center justify-between bg-white/50 backdrop-blur-md">
                <h3 className="font-bold text-base text-neutral-dark">Nội dung khóa học</h3>
                <button
                    onClick={onCloseSidebar}
                    className="md:hidden p-1 rounded hover:bg-hover-light text-neutral-medium cursor-pointer"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {sidebarSections && sidebarSections.map((section) => (
                    <div key={section.id} className="border-b border-border-light">
                        <div className="w-full flex items-center justify-between p-4 bg-white/30 text-left">
                            <div>
                                <span className="text-[10px] font-bold text-neutral-light block uppercase mb-0.5">
                                    {section.statusText}
                                </span>
                                <h4 className="text-sm font-bold text-neutral-dark">{section.title}</h4>
                            </div>
                        </div>
                        <div className="bg-white/10">
                            {section.lessons && section.lessons.map((item) => {
                                const isThisCompleted = item.isCompleted || (item.isActive && isCompleted);

                                if (isThisCompleted) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between p-3.5 pl-5 hover:bg-white/40 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <CheckCircle size={16} className="text-success mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-dark group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <span className="text-xs text-neutral-light flex items-center gap-1 mt-1">
                                                        <PlayCircle size={12} /> {item.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            {item.completedBy && (
                                                <div className="flex -space-x-1.5 mt-1">
                                                    {item.completedBy.map((user, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="w-2.5 h-2.5 rounded-full bg-success border border-white"
                                                            title={`${user} completed`}
                                                        ></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                if (item.isActive) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between p-3.5 pl-5 bg-sky-50/70 border-l-4 border-primary"
                                        >
                                            <div className="flex items-start gap-3">
                                                <PlayCircle size={16} className="text-primary mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="text-sm font-bold text-primary">
                                                        {item.title}
                                                    </p>
                                                    <span className="text-xs text-primary flex items-center gap-1 mt-1">
                                                        <PlayCircle size={12} /> {item.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            {item.partnerLearning && (
                                                <div className="mt-1">
                                                    <img
                                                        className="w-5 h-5 rounded-full border border-sky-200 object-cover"
                                                        src={item.partnerLearning.avatar}
                                                        alt={item.partnerLearning.name}
                                                        title={`${item.partnerLearning.name} đang học`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between p-3.5 pl-5 hover:bg-white/40 transition-all cursor-pointer group opacity-65"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Lock size={16} className="text-neutral-light mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-neutral-medium group-hover:text-neutral-dark transition-colors">
                                                    {item.title}
                                                </p>
                                                <span className="text-xs text-neutral-light flex items-center gap-1 mt-1">
                                                    <PlayCircle size={12} /> {item.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default CourseSidebar;
