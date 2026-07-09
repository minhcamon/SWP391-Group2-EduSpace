import React from "react";
import { Link } from "react-router";
import { MoreVertical, Users, Activity, HelpCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export const MentorClassCard = ({ classItem }) => {
  const {
    id,
    courseTitle,
    cohortName,
    semester,
    studentCount,
    averageProgress,
    unansweredQuestions,
    pairs = []
  } = classItem;

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-border-light/35 flex flex-col transition-all hover:shadow-md duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-neutral-dark">
            {courseTitle} - {cohortName}
          </h2>
          <div className="flex gap-2 items-center">
            <Badge variant="roletag" className="text-[10px] px-2.5 py-0.5 uppercase">
              Mentor
            </Badge>
            <span className="text-neutral-medium text-xs font-medium">
              • {semester}
            </span>
          </div>
        </div>
        <button className="text-neutral-light hover:text-neutral-dark hover:bg-slate-50 p-2 rounded-full transition-colors cursor-pointer">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-bg-base border border-border-light/20 p-3.5 rounded-xl text-center">
          <p className="text-[11px] font-semibold text-neutral-medium mb-1.5">Sĩ số</p>
          <p className="text-lg font-extrabold text-primary flex items-center justify-center gap-1">
            <Users className="w-4 h-4" /> {studentCount}
          </p>
        </div>
        <div className="bg-bg-base border border-border-light/20 p-3.5 rounded-xl text-center">
          <p className="text-[11px] font-semibold text-neutral-medium mb-1.5">Tiến độ TB</p>
          <p className="text-lg font-extrabold text-tertiary flex items-center justify-center gap-1">
            <Activity className="w-4 h-4" /> {averageProgress}%
          </p>
        </div>
        <div className={`p-3.5 rounded-xl text-center border ${
          unansweredQuestions > 0
            ? "bg-amber-50 border-amber-200"
            : "bg-bg-base border-border-light/20"
        }`}>
          <p className={`text-[11px] font-semibold mb-1.5 ${
            unansweredQuestions > 0 ? "text-secondary" : "text-neutral-medium"
          }`}>
            Chưa trả lời
          </p>
          <p className={`text-lg font-extrabold flex items-center justify-center gap-1 ${
            unansweredQuestions > 0 ? "text-secondary" : "text-neutral-medium"
          }`}>
            <HelpCircle className="w-4 h-4" /> {unansweredQuestions}
          </p>
        </div>
      </div>

      {/* Pair Monitor Section */}
      <div className="grow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-medium">
            Pair Monitor
          </h3>
          <span className="text-xs text-neutral-light italic">
            Trung bình: {averageProgress}%
          </span>
        </div>
        <div className="space-y-3.5">
          {pairs.map((pair) => (
            <div key={pair.id} className="flex items-center gap-4">
              {/* Stacked Avatars */}
              <div className="flex -space-x-2.5 relative shrink-0">
                <img
                  alt={pair.student1.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src={pair.student1.avatar}
                />
                <img
                  alt={pair.student2.name}
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  src={pair.student2.avatar}
                />
                {pair.status === "SLOW" && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-danger rounded-full border-2 border-white animate-pulse" />
                )}
              </div>

              {/* Progress and name */}
              <div className="grow min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className={`font-semibold truncate ${
                    pair.status === "SLOW" ? "text-danger" : "text-neutral-dark"
                  }`}>
                    {pair.student1.name} & {pair.student2.name} {pair.status === "SLOW" && "(Chậm)"}
                  </span>
                  <span className={`font-bold ${
                    pair.status === "SLOW" ? "text-danger" : "text-neutral-medium"
                  }`}>
                    {pair.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      pair.status === "SLOW" ? "bg-danger" : "bg-primary"
                    }`}
                    style={{ width: `${pair.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6 pt-4 border-t border-border-light/25">
        <Link to={`/classes/${id}`} className="block w-full">
          <Button variant="secondary" className="w-full h-10 text-xs font-bold py-2 hover:scale-[0.98] transition-all">
            Vào quản lý lớp học
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default MentorClassCard;
