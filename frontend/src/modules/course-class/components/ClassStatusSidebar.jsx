import { Users, Plus } from "lucide-react";
import Avatar from "@/components/common/Avatar";

export const ClassStatusSidebar = ({
  currentStudents = 8,
  maxStudents = 10,
  members = [],
}) => {
  const emptySlots = Math.max(0, maxStudents - currentStudents);

  return (
    <div className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-sm sticky top-24">
      {/* Title */}
      <div className="flex items-center justify-between mb-6 border-b border-border-light/25 pb-4">
        <div>
          <h2 className="text-base font-bold text-neutral-dark">Trạng thái phòng học</h2>
          <p className="text-xs text-neutral-medium">
            {currentStudents}/{maxStudents} thành viên đã sẵn sàng
          </p>
        </div>
        <Users className="w-5 h-5 text-primary" />
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mb-6">
        {members.map((member, i) => {
          const name = member.fullName || member.name || "Học viên";
          return (
            <Avatar
              key={member.id || i}
              title={name}
              alt={`${name} Avatar`}
              className="w-10 h-10 border border-border-light/20 shadow-sm"
              src={member.avatarUrl}
            />
          );
        })}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full border-2 border-dashed border-border-light/60 bg-bg-base flex items-center justify-center text-neutral-light hover:text-primary transition-colors cursor-pointer"
            title="Đang đợi người tham gia"
          >
            <Plus className="w-4 h-4" />
          </div>
        ))}
      </div>

      {/* Pulsing Status */}
      <div className="text-center pt-2">
        <p className="text-xs font-semibold text-neutral-medium flex items-center justify-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          Đang đợi thêm thành viên...
        </p>
      </div>
    </div>
  );
};

export default ClassStatusSidebar;
