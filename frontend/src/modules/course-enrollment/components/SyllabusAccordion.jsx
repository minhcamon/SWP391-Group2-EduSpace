import { useState, useEffect } from "react";
import { ChevronDown, CheckCircle2, PlayCircle, Lock } from "lucide-react";

export const SyllabusAccordion = ({ syllabus = [] }) => {
  const [openSections, setOpenSections] = useState({});

  // Automatically open the first section when the syllabus is loaded
  useEffect(() => {
    if (syllabus && syllabus.length > 0 && Object.keys(openSections).length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenSections({ [syllabus[0].id]: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syllabus]);

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!syllabus || syllabus.length === 0) {
    return (
      <div className="text-center py-6 text-neutral-medium bg-white rounded-xl border border-border-light/35 p-6 shadow-sm">
        Chưa có giáo trình chi tiết cho khóa học này.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-neutral-dark">Giáo trình chi tiết</h2>
      <div className="flex flex-col gap-3">
        {syllabus.map((section) => {
          const isOpen = !!openSections[section.id];
          
          // Lấy danh sách bài học và bài tập từ dữ liệu Backend
          const lessons = section.lessons || [];
          const assignment = section.assignment;

          // Hợp nhất bài học và bài tập thành danh sách hiển thị
          const items = [
            ...lessons.map((lesson) => ({
              id: `lesson-${lesson.id}`,
              title: lesson.title,
              type: "lesson"
            })),
            ...(assignment ? [{
              id: `assignment-${assignment.id}`,
              title: `Bài tập: ${assignment.title}`,
              type: "assignment"
            }] : [])
          ];

          const totalCount = items.length;
          // Mặc định hoàn thành là 0 trong trang xem chi tiết khóa học, hoặc lấy từ thuộc tính hoàn thành nếu có
          const completedCount = section.completedCount || 0;
          const isCompleted = completedCount === totalCount && totalCount > 0;

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-border-light/40 shadow-sm overflow-hidden transition-all duration-200"
            >
              <button
                type="button"
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-bg-card transition-colors duration-150 focus:outline-none"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold text-neutral-dark">
                    {section.title}
                  </h3>
                  <span className="text-xs text-neutral-medium mt-1">
                    Phần {section.sortOrder || section.id} • {completedCount}/{totalCount} Bài hoàn thành
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-medium transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? "max-h-[500px] opacity-100 border-t border-border-light/20" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                {isOpen && (
                  <div className="px-6 py-4 bg-bg-base/30 flex flex-col gap-3">
                    {items.map((item, index) => {
                      // Mô phỏng trạng thái hoàn thành cho các bài học
                      let status = "locked";
                      if (isCompleted || index < completedCount) {
                        status = "completed";
                      } else if (index === completedCount && !isCompleted) {
                        status = "current";
                      }

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-150 ${
                            status === "current"
                              ? "bg-primary/5 border border-primary/20 text-primary font-medium"
                              : "text-neutral-medium"
                          }`}
                        >
                          {status === "completed" && (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          )}
                          {status === "current" && (
                            <PlayCircle className="w-5 h-5 text-primary" />
                          )}
                          {status === "locked" && (
                            <Lock className="w-4 h-4 text-neutral-light" />
                          )}

                          <span className={`text-sm ${status === "locked" ? "text-neutral-light" : "text-neutral-dark"}`}>
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SyllabusAccordion;
