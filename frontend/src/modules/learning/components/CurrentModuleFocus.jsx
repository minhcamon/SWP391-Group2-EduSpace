import {
  Check,
  Lock,
  RefreshCw,
  Clock,
  Award,
  CheckCircle,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import Avatar from "@/components/common/Avatar";

// Helper function to map lesson state to UI config, avoiding nested ternaries in JSX
const getLessonStateConfig = (lesson, isUnlocked) => {
  const isLessonCompleted = lesson.isCompleted ?? lesson.completed;
  if (isLessonCompleted) {
    return {
      containerClass: "bg-tertiary/10 border-tertiary/10 hover:bg-tertiary/20",
      icon: (
        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
          <Check size={12} strokeWidth={3} />
        </div>
      ),
      titleClass:
        "text-neutral-medium line-through decoration-neutral-light/45",
      badgeClass: "bg-emerald-100 text-emerald-800",
      badgeText: "Đã xem",
      btnClass: "bg-slate-100 hover:bg-slate-200/80 text-neutral-medium",
      btnIcon: <PlayCircle size={14} />,
      btnText: "Vào học",
    };
  }

  if (!isUnlocked) {
    return {
      containerClass:
        "bg-slate border-slate-100 opacity-100 cursor-not-allowed",
      icon: (
        <div className="w-5 h-5 rounded-full bg-slate border border-slate flex items-center justify-center">
          <Lock size={10} />
        </div>
      ),
      titleClass: "text-neutral-light",
      badgeClass: "bg-slate text-neutral-light",
      badgeText: "Đang khóa",
      btnClass: "bg-slate-100 text-neutral-light cursor-not-allowed opacity-80",
      btnIcon: <Lock size={12} />,
      btnText: "Đang khóa",
    };
  }

  // Default: Uncompleted & Unlocked (Chưa xem but ready to learn)
  return {
    containerClass: "bg-primary/10 border-primary/10 hover:bg-primary/20",
    icon: (
      <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white"></div>
    ),
    titleClass: "text-neutral-dark",
    badgeClass: "bg-slate-100 text-neutral-medium",
    badgeText: "Đang xem",
    btnClass:
      "bg-primary hover:bg-primary/95 text-white shadow-sm hover:scale-[1.02]",
    btnIcon: <PlayCircle size={14} />,
    btnText: "Vào học",
  };
};

const CurrentModuleFocus = ({
  currentModule,
  partner,
  handleContinueLearning,
}) => {
  if (!currentModule) {
    return (
      <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-border-light/35 flex flex-col items-center justify-center space-y-3">
        <Award size={48} className="text-secondary animate-bounce" />
        <h2 className="text-lg font-bold text-neutral-dark">
          Chúc mừng bạn đã hoàn thành khóa học!
        </h2>
        <p className="text-sm text-neutral-medium max-w-md">
          Bạn đã xuất sắc vượt qua toàn bộ các module trong lộ trình này. Hãy
          chuyển sang phần học tập nâng cao khác!
        </p>
      </div>
    );
  }

  const totalLessons = currentModule.totalLessons ?? currentModule.lessons?.length ?? 0;
  const completedLessons = currentModule.completedLessons ?? currentModule.lessons?.filter((l) => l.isCompleted ?? l.completed).length ?? 0;
  const currentModulePercent = currentModule.progress ?? (totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0);

  // Sort lessons by sortOrder field
  const sortedLessons = [...(currentModule.lessons || [])].sort(
    (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-border-light/35 space-y-6">
      {/* Current Module Focus Header */}
      <div className="border-b border-slate-100 pb-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              Module tiêu điểm hiện tại
            </span>
            <h1 className="text-xl font-extrabold text-neutral-dark mt-2">
              {currentModule.title}
            </h1>
          </div>
          <span className="px-3 py-1 bg-sky-50 text-primary rounded-full text-xs font-bold border border-sky-100 flex items-center gap-1.5">
            <RefreshCw size={12} className="animate-spin-slow" />
            Đồng bộ với đối tác
          </span>
        </div>

        <p className="text-sm text-neutral-medium leading-relaxed">
          {currentModule.description}
        </p>

        {/* Progress Bar inside Current Module Focus */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-neutral-medium">
              Tiến độ hoàn thành Module
            </span>
            <span className="text-secondary">
              {completedLessons}/{totalLessons} Bài học ({currentModulePercent}
              %)
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-secondary rounded-full shadow-sm"
              style={{ width: `${currentModulePercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Lesson Checklist with Lock sequence */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-neutral-dark flex items-center gap-2 mb-2">
          <CheckCircle size={16} className="text-primary" />
          Danh sách bài học & Lộ trình tuần tự
        </h3>

        <div className="space-y-3">
          {sortedLessons.map((lesson, index, arr) => {
            // Lesson is unlocked if it is not locked by backend and all previous lessons are completed
            const isUnlocked = !(lesson.isLocked ?? lesson.locked ?? false) && (index === 0 || arr.slice(0, index).every((l) => l.isCompleted ?? l.completed));
            const config = getLessonStateConfig(lesson, isUnlocked);
            const isPartnerCurrent = lesson.partnerCurrent ?? lesson.isPartnerCurrent;

            return (
              <div
                key={lesson.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${config.containerClass}`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Checkbox / Lock icon */}
                  <div className="shrink-0">{config.icon}</div>

                  <div className="space-y-1">
                    <h4 className={`text-sm font-bold ${config.titleClass}`}>
                      {lesson.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-neutral-light font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {lesson.duration}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${config.badgeClass}`}
                      >
                        {config.badgeText}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Partner Status representation */}
                  {isPartnerCurrent && partner && (
                    <div className="flex items-center gap-1.5 bg-sky-50 border border-sky-100 px-2 py-1 rounded-full text-[10px] font-bold text-primary animate-pulse">
                      <Avatar
                        src={partner.avatarUrl || partner.avatar}
                        alt="Partner current learning"
                        className="w-5 h-5 border border-primary"
                      />
                      <span className="hidden sm:inline">
                        Đối tác đang ở đây
                      </span>
                    </div>
                  )}

                  {lesson.completedByPartner &&
                    !isPartnerCurrent &&
                    partner && (
                      <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-full text-[10px] font-semibold text-neutral-medium">
                        <Avatar
                          src={partner.avatarUrl || partner.avatar}
                          alt="Partner completed"
                          className="w-4 h-4 grayscale opacity-70"
                        />
                        <span className="hidden sm:inline text-[9px]">
                          Đối tác xong
                        </span>
                      </div>
                    )}

                  <button
                    disabled={!isUnlocked}
                    onClick={handleContinueLearning}
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${config.btnClass}`}
                  >
                    {config.btnIcon}
                    <span className="hidden sm:inline">{config.btnText}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Start Learning / Continue button at bottom */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={handleContinueLearning}
          className="bg-secondary hover:bg-secondary/95 text-white font-extrabold text-sm px-6 py-3 rounded-full flex items-center gap-2 transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
        >
          Tiếp tục bài học
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CurrentModuleFocus;
