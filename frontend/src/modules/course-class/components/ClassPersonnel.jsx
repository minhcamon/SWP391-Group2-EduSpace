import React from "react";
import { Users, Handshake } from "lucide-react";
import Avatar from "@/components/common/Avatar";

export const ClassPersonnel = ({ pairs = [] }) => {
  const totalStudents = pairs.reduce((acc, pair) => acc + (pair.members?.length || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Class Directory Box */}
      <div className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-border-light/25 pb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-dark">Thành viên lớp học</h2>
            <p className="text-xs text-neutral-medium">{totalStudents} Học viên đang hoạt động</p>
          </div>
          <Users className="w-5 h-5 text-primary" />
        </div>

        <div className="flex flex-col gap-3">
          {pairs.map((pair) => (
            <div
              key={pair.id}
              className="bg-bg-base/40 p-4 rounded-xl border border-border-light/35 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-secondary tracking-wider uppercase">
                  {pair.pairName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${pair.status === "ACTIVE"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {pair.status === "ACTIVE" ? "HOẠT ĐỘNG" : "TẠM NGHỈ"}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3 flex-wrap">
                {pair.members && pair.members.map((member, mIdx) => (
                  <div key={member.id || mIdx} className="flex items-center gap-3">
                    {mIdx > 0 && <Handshake className="w-4 h-4 text-neutral-light/70 shrink-0" />}
                    <div className="flex flex-col items-center gap-1">
                      <Avatar
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 border border-border-light shadow-sm"
                      />
                      <span className="text-xs text-neutral-dark font-medium text-center truncate max-w-[80px]">
                        {member.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassPersonnel;
