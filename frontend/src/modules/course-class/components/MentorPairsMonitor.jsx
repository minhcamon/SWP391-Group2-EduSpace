import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import Avatar from "@/components/common/Avatar";

export const MentorPairsMonitor = ({ pairs = [] }) => {
  return (
    <div className="flex flex-col gap-4">
      {pairs.map((p) => (
        <article
          key={p.id}
          className="bg-white p-4 rounded-2xl border border-border-light/35 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3.5">
              <Avatar
                src={p.avatar1}
                alt="Student 1"
                className="w-10 h-10 border-2 border-white shadow-sm"
              />
              <Avatar
                src={p.avatar2}
                alt="Student 2"
                className="w-10 h-10 border-2 border-white shadow-sm"
              />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-dark">
                {p.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                    p.status === "NEED_SUPPORT"
                      ? "bg-red-100 text-red-700 animate-pulse"
                      : p.status === "OFFLINE"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {p.status === "NEED_SUPPORT" 
                    ? "CẦN HỖ TRỢ" 
                    : p.status === "OFFLINE" 
                    ? "NGOẠI TUYẾN" 
                    : "HOẠT ĐỘNG"}
                </span>
                <span className="text-[11px] text-neutral-light font-medium">
                  {p.lesson}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 flex-1 max-w-xs justify-end">
            <div className="w-24 bg-bg-card h-1.5 rounded-full overflow-hidden shrink-0 hidden md:block">
              <div
                className={`h-full rounded-full ${
                  p.status === "NEED_SUPPORT" ? "bg-red-500" : "bg-secondary"
                }`}
                style={{ width: `${p.progress}%` }}
              />
            </div>
            {p.status === "NEED_SUPPORT" ? (
              <Button
                onClick={() => toast.info(`Đang kết nối hỗ trợ cho cặp ${p.name}...`)}
                className="bg-primary text-white hover:bg-primary/95 text-xs py-3 px-4 shadow-sm font-bold cursor-pointer"
              >
                Xử lý ngay
              </Button>
            ) : (
              <Button
                onClick={() => toast.info(`Đang liên hệ cặp ${p.name}...`)}
                variant="outline"
                className="border-primary/20 text-primary hover:bg-primary/5 text-xs py-3 px-4 font-semibold cursor-pointer"
              >
                Hỗ trợ
              </Button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default MentorPairsMonitor;
