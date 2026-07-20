import { ArrowRight, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Avatar from "@/components/common/Avatar";
import { Link } from "react-router";

export const EnrollmentSidebar = ({
  waitlistMembers = [],
  maxStudents = 10,
  onEnroll,
  onLeave,
  isEnrolled = false,
  targetClassId = null,
}) => {
  const currentStudents = waitlistMembers.length;
  const percent = Math.min(100, Math.round((currentStudents / maxStudents) * 100));

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
          {waitlistMembers.map((member, i) => {
            return (
              <Avatar
                key={member.id || i}
                src={member.avatarUrl}
                title={member.fullName || "Học viên"}
                alt={member.fullName || "Student Avatar"}
                className="w-10 h-10 border-2 border-white shadow-sm"
              />
            );
          })}
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
        {isEnrolled || targetClassId ? (
          <div className="flex flex-col gap-2.5">
            {(targetClassId || currentStudents >= maxStudents || new URLSearchParams(window.location.search).get("status") === "active") ? (
              <>
                <div className="w-full py-3 px-4 font-semibold rounded-xl flex items-center justify-center gap-2 text-emerald-600 border border-emerald-100 bg-emerald-50 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span>Lớp học đã bắt đầu!</span>
                </div>
                <Link
                  to={`/classes/${targetClassId || 1}`}
                  className="w-full py-4 font-semibold flex items-center justify-center gap-2 text-white bg-primary hover:bg-primary/95 rounded-xl shadow-sm transition-all text-sm text-center animate-bounce"
                >
                  <span>Đến lớp học</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                <div className="w-full py-3 px-4 font-semibold rounded-xl flex items-center justify-center gap-2 text-primary border border-primary/20 bg-primary/10 text-xs">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse shrink-0"></span>
                  <span>Đang trong hàng chờ ghép cặp</span>
                </div>
                <Button
                  onClick={onLeave}
                  variant="outline"
                  className="w-full py-4 font-semibold flex items-center justify-center gap-2 text-neutral-medium border-border-light hover:bg-bg-card hover:text-neutral-dark rounded-xl shadow-sm transition-all text-sm"
                >
                  <span>Hủy tham gia hàng chờ</span>
                </Button>
                <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl text-xs text-primary leading-relaxed">
                  Lớp học đang được thiết lập (Hiện tại: {currentStudents}/{maxStudents} bạn). Hệ thống sẽ tự động ghép cặp ngay khi đủ người. Bạn không cần đợi ở đây, chúng tôi sẽ gửi một Email thông báo kèm link trực tiếp ngay khi lớp học sẵn sàng!
                </div>
              </>
            )}
          </div>
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
