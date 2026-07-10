import React from "react";
import { Link } from "react-router";
import { Users, BookOpen, GraduationCap } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const STATUS_MAP = {
  ACTIVE: { label: "Đang hoạt động", color: "bg-emerald-100 text-emerald-700" },
  UPCOMING: { label: "Sắp khai giảng", color: "bg-blue-100 text-blue-700" },
  COMPLETED: { label: "Đã kết thúc", color: "bg-slate-100 text-slate-500" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-600" },
};

export const MentorClassCard = ({ classItem }) => {
  const {
    id,
    name,
    courseTitle,
    status,
    numberOfPairs,
  } = classItem;

  const statusInfo = STATUS_MAP[status] ?? { label: status, color: "bg-slate-100 text-slate-500" };

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-border-light/35 flex flex-col transition-all hover:shadow-md duration-200">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h2 className="text-lg font-bold text-neutral-dark truncate">{name}</h2>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="roletag" className="text-[10px] px-2.5 py-0.5 uppercase shrink-0">
              Mentor
            </Badge>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="flex items-center gap-2 mb-5 p-3 bg-bg-base rounded-xl border border-border-light/20">
        <BookOpen className="w-4 h-4 text-primary shrink-0" />
        <span className="text-xs font-semibold text-neutral-dark truncate">{courseTitle}</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6 grow">
        <div className="bg-bg-base border border-border-light/20 p-3.5 rounded-xl text-center">
          <p className="text-[11px] font-semibold text-neutral-medium mb-1.5">Số cặp học viên</p>
          <p className="text-2xl font-extrabold text-primary flex items-center justify-center gap-1">
            <Users className="w-4 h-4" />
            {numberOfPairs ?? 0}
          </p>
        </div>
        <div className="bg-bg-base border border-border-light/20 p-3.5 rounded-xl text-center">
          <p className="text-[11px] font-semibold text-neutral-medium mb-1.5">Học viên</p>
          <p className="text-2xl font-extrabold text-tertiary flex items-center justify-center gap-1">
            <GraduationCap className="w-4 h-4" />
            {(numberOfPairs ?? 0) * 2}
          </p>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-4 border-t border-border-light/25">
        <Link to={`/mentor/classes/${id}`} className="block w-full">
          <Button variant="secondary" className="w-full h-10 text-xs font-bold py-2 hover:scale-[0.98] transition-all">
            Vào quản lý lớp học
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default MentorClassCard;
