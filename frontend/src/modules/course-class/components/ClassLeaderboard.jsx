import { toast } from "sonner";
import Avatar from "@/components/common/Avatar";

export const ClassLeaderboard = ({
  leaderboardMode = "individual",
  setLeaderboardMode,
  individualLeaderboard = [],
  pairLeaderboard = [],
}) => {
  return (
    <div className="space-y-6">
      {/* Sub toggle mode */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-neutral-dark">
          Xếp hạng học tập
        </h3>
        
        <div className="bg-bg-card p-1 rounded-xl flex items-center">
          <button
            onClick={() => setLeaderboardMode("individual")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              leaderboardMode === "individual"
                ? "bg-white text-primary shadow-xs"
                : "text-neutral-medium hover:text-neutral-dark"
            }`}
          >
            Cá nhân
          </button>
          <button
            onClick={() => setLeaderboardMode("pair")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              leaderboardMode === "pair"
                ? "bg-white text-primary shadow-xs"
                : "text-neutral-medium hover:text-neutral-dark"
            }`}
          >
            Theo Cặp
          </button>
        </div>
      </div>

      {/* Leaderboard Table Grid */}
      <div className="bg-white rounded-2xl border border-border-light/35 shadow-xs overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-6 py-4 border-b border-border-light/25 bg-bg-card/40 font-semibold text-xs text-neutral-light uppercase tracking-wider">
          <div className="col-span-2">Hạng</div>
          <div className="col-span-6">Thành viên</div>
          <div className="col-span-4 text-center">Tiến độ</div>
        </div>

        {/* Body */}
        <div className="divide-y divide-border-light/20">
          {leaderboardMode === "individual" ? (
            individualLeaderboard.map((item) => (
              <div
                key={item.rank}
                className={`grid grid-cols-12 gap-3 px-6 py-4 items-center transition-all ${
                  item.isSelf
                    ? "bg-primary/5 border-l-4 border-primary font-bold"
                    : "hover:bg-bg-base/40"
                }`}
              >
                <div className="col-span-2">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold italic text-sm ${
                      item.rank === 1
                        ? "bg-secondary/15 text-secondary"
                        : item.rank === 2
                        ? "bg-primary/15 text-primary"
                        : "bg-bg-card text-neutral-medium"
                    }`}
                  >
                    {item.rank}
                  </span>
                </div>

                <div className="col-span-6 flex items-center gap-3">
                  <Avatar
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 border border-border-light/25"
                  />
                  <div>
                    <p
                      className={`text-sm ${
                        item.isSelf ? "text-primary font-extrabold" : "text-neutral-dark font-semibold"
                      }`}
                    >
                      {item.name} {item.isSelf && "(Bạn)"}
                    </p>
                    {item.target && (
                      <p className="text-[11px] text-neutral-light">
                        {item.target}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-4 px-2">
                  <div className="flex justify-between items-center text-[10px] text-neutral-medium mb-1">
                    <span>Hoàn thành {item.progress}%</span>
                  </div>
                  <div className="w-full bg-bg-card h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.rank === 1 ? "bg-secondary" : "bg-primary"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            pairLeaderboard.map((item) => (
              <div
                key={item.rank}
                className={`grid grid-cols-12 gap-3 px-6 py-4 items-center transition-all ${
                  item.isSelf
                    ? "bg-primary/5 border-l-4 border-primary font-bold"
                    : "hover:bg-bg-base/40"
                }`}
              >
                <div className="col-span-2">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold italic text-sm ${
                      item.rank === 1
                        ? "bg-secondary/15 text-secondary"
                        : item.rank === 2
                        ? "bg-primary/15 text-primary"
                        : "bg-bg-card text-neutral-medium"
                    }`}
                  >
                    {item.rank}
                  </span>
                </div>

                <div className="col-span-6 flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {item.avatars && item.avatars.map((avatar, idx) => (
                      <Avatar
                        key={idx}
                        src={avatar}
                        alt={`Student ${idx + 1}`}
                        className="w-9 h-9 border-2 border-white"
                      />
                    ))}
                  </div>
                  <div>
                    <p
                      className={`text-sm ${
                        item.isSelf ? "text-primary font-extrabold" : "text-neutral-dark font-semibold"
                      }`}
                    >
                      {item.name}
                    </p>
                    {item.detail && (
                      <p className="text-[11px] text-neutral-light">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>

                <div className="col-span-4 px-2">
                  <div className="flex justify-between items-center text-[10px] text-neutral-medium mb-1">
                    <span>TB {item.progress}%</span>
                  </div>
                  <div className="w-full bg-bg-card h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        item.rank === 1 ? "bg-secondary" : "bg-primary"
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 text-center border-t border-border-light/20 bg-bg-card/25">
          <button 
            onClick={() => toast.info("Đang hiển thị toàn bộ thành viên...")}
            className="text-xs text-primary font-bold hover:underline cursor-pointer"
          >
            Xem tất cả {individualLeaderboard.length} thành viên
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassLeaderboard;
