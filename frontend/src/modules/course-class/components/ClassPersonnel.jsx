import { Users, Handshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const ClassPersonnel = ({ pairs = [], onFindBuddy }) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Class Directory Box */}
      <div className="bg-white p-6 rounded-2xl border border-border-light/30 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-border-light/25 pb-4">
          <div>
            <h2 className="text-base font-bold text-neutral-dark">Thành viên lớp học</h2>
            <p className="text-xs text-neutral-medium">{pairs.length * 2} Học viên đang hoạt động</p>
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
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    pair.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {pair.status === "ACTIVE" ? "HOẠT ĐỘNG" : "TẠM NGHỈ"}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <img
                    alt={pair.student1.name}
                    className="w-10 h-10 rounded-full object-cover border border-border-light shadow-sm"
                    src={pair.student1.avatar}
                  />
                  <span className="text-xs text-neutral-dark font-medium">
                    {pair.student1.name}
                  </span>
                </div>

                <Handshake className="w-4 h-4 text-neutral-light" />

                <div className="flex flex-col items-center gap-1">
                  <img
                    alt={pair.student2.name}
                    className="w-10 h-10 rounded-full object-cover border border-border-light shadow-sm"
                    src={pair.student2.avatar}
                  />
                  <span className="text-xs text-neutral-dark font-medium">
                    {pair.student2.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border-light/25">
          <Button
            variant="outline"
            className="w-full py-5 text-primary text-xs font-semibold hover:bg-primary/5 border-primary/20"
          >
            Quản lý cặp đôi
          </Button>
        </div>
      </div>

      {/* Buddy Promotion Widget */}
      <div className="bg-primary p-6 rounded-2xl text-white shadow-md relative overflow-hidden group">
        <div className="relative z-10 flex flex-col gap-3">
          <h4 className="text-base font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-secondary" />
            Cần tìm bạn học?
          </h4>
          <p className="text-xs text-white/95 leading-relaxed">
            Ghép cặp ngẫu nhiên với một thành viên khác trong lớp để có phiên học 15 phút tập trung cao độ.
          </p>
          <Button
            onClick={onFindBuddy}
            className="bg-white text-primary border-none font-bold text-xs py-4 px-4 hover:bg-white/90 active:scale-95 transition-all self-start"
          >
            Tìm bạn ngay
          </Button>
        </div>
        
        {/* Backdrop icon decoration */}
        <Users className="w-24 h-24 absolute -bottom-6 -right-6 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default ClassPersonnel;
