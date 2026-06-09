import React from "react";
import { Users, ArrowRight, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const EnrollmentSidebar = ({
  currentStudents = 7,
  maxStudents = 10,
  onEnroll,
  isEnrolled = false,
}) => {
  const percent = Math.min(100, Math.round((currentStudents / maxStudents) * 100));
  
  // Fake avatars for UI display
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100&auto=format&fit=crop",
  ];

  // Number of empty slots
  const emptySlots = Math.max(0, maxStudents - currentStudents);

  return (
    <div className="sticky top-24 bg-white rounded-2xl border border-border-light/40 p-6 shadow-md flex flex-col gap-6">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-neutral-medium uppercase tracking-wider mb-2">
          Trạng thái tuyển sinh
        </span>
        <h3 className="text-xl font-bold text-neutral-dark mb-4">
          Lớp học hiện tại:{" "}
          <span className="text-secondary font-extrabold">{currentStudents}/{maxStudents}</span>{" "}
          học viên
        </h3>
        
        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-bg-card rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Avatars & Slots */}
        <div className="flex flex-wrap gap-2 mb-2">
          {avatars.slice(0, currentStudents).map((url, i) => (
            <img
              key={i}
              alt="Student Avatar"
              className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
              src={url}
            />
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full border-2 border-dashed border-border-light flex items-center justify-center bg-bg-base text-neutral-light hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>

      <hr className="border-border-light/25" />

      <div className="flex flex-col gap-4">
        {isEnrolled ? (
          <Button
            variant="outline"
            className="w-full py-6 font-semibold flex items-center justify-center gap-2 text-primary border-primary bg-primary/5 cursor-default hover:bg-primary/5 active:translate-y-0"
            disabled
          >
            Đã đăng ký lớp học
          </Button>
        ) : (
          <Button
            onClick={onEnroll}
            variant="secondary"
            className="w-full py-6 font-semibold flex items-center justify-center gap-2 text-white bg-secondary hover:bg-secondary/90 shadow-sm active:scale-[0.98] transition-all"
          >
            <span>Tham gia lớp học ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}

        <div className="flex gap-2 p-3 rounded-xl bg-bg-card border border-border-light/30 text-xs text-neutral-medium leading-relaxed">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p>
            Hệ thống sẽ tự động chạy thuật toán ghép cặp ngẫu nhiên (2-3 người)
            ngay khi lớp học đủ <strong>10 thành viên</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSidebar;
