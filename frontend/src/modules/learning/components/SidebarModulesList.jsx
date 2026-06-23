import React from "react";
import { BookOpen, Check, Lock } from "lucide-react";

// Helper function to get styles and labels based on module status to avoid nested ternaries
const getModuleConfig = (status) => {
  switch (status) {
    case "COMPLETED":
      return {
        containerClass: "bg-tertiary/10 border-tertiary/10 hover:border-tertiary/20",
        badgeClass: "bg-tertiary/10 text-tertiary/100",
        badgeText: "Xong",
        badgeIcon: <Check size={8} strokeWidth={3} />,
        progressBarClass: "bg-tertiary",
        showProgressBar: true
      };
    case "IN_PROGRESS":
      return {
        containerClass: "bg-sky-50/40 border-primary/40 ring-1 ring-primary/20 hover:border-primary/60",
        badgeClass: "bg-sky-100 text-primary animate-pulse",
        badgeText: "Đang học",
        badgeIcon: null,
        progressBarClass: "bg-primary",
        showProgressBar: true
      };
    default: // NOT_STARTED
      return {
        containerClass: "bg-slate-50/20 border-slate-200/60 opacity-85",
        badgeClass: "bg-slate-100 text-neutral-light",
        badgeText: "Khóa",
        badgeIcon: <Lock size={8} />,
        progressBarClass: "",
        showProgressBar: false
      };
  }
};

const SidebarModulesList = ({ modules }) => {
  // Sort modules by sortOrder field
  const sortedModules = [...modules].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-border-light/35 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-sm font-bold text-neutral-dark">
          Tiến trình Khóa học
        </h3>
        <p className="text-xs text-neutral-light mt-0.5">Toàn bộ lộ trình học tập của bạn</p>
      </div>

      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {sortedModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-neutral-light">
            <BookOpen size={24} className="stroke-[1.5] mb-2 text-slate-300" />
            <p className="text-xs">Không có module nào.</p>
          </div>
        ) : (
          sortedModules.map((item) => {
            const mTotal = item.lessons?.length || 0;
            const mCompleted = item.lessons?.filter(l => l.isCompleted).length || 0;
            const mPercent = mTotal > 0 ? Math.round((mCompleted / mTotal) * 100) : 0;

            const config = getModuleConfig(item.status);

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${config.containerClass}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h4 className="text-xs font-bold text-neutral-dark leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${config.badgeClass}`}>
                    {config.badgeIcon}
                    {config.badgeText}
                  </span>
                </div>

                {config.showProgressBar ? (
                  <div className="space-y-1.5 mt-2">
                    <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${config.progressBarClass}`}
                        style={{ width: `${mPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-neutral-light font-bold">
                      <span>{mCompleted}/{mTotal} Bài học</span>
                      <span>{mPercent}%</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-[9px] text-neutral-light font-bold mt-2">
                    <span className="flex items-center gap-1">
                      <BookOpen size={10} />
                      {mTotal} Bài học
                    </span>
                    <span>Chưa học tới</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SidebarModulesList;
