import { TrendingUp, Database } from "lucide-react";

export const ClassLeaderboardSidebar = ({
  points = "2,150 pts",
  progress = "Top 20% Lớp",
  partnerName = "Thúy Hạnh",
  partnerAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
}) => {
  return (
    <div className="space-y-6">
      {/* Leaderboard stats widgets */}
      <div className="bg-primary text-white p-5 rounded-2xl shadow-md flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10 space-y-1">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            Tiến độ cá nhân
          </p>
          <h3 className="text-lg font-extrabold">
            {progress}
          </h3>
        </div>
        <TrendingUp className="w-12 h-12 opacity-25 group-hover:scale-110 transition-transform duration-300" />
      </div>

      <div className="bg-secondary text-white p-5 rounded-2xl shadow-md flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10 space-y-1">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            Điểm tích lũy
          </p>
          <h3 className="text-lg font-extrabold">
            {points}
          </h3>
        </div>
        <Database className="w-12 h-12 opacity-25 group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Partner active info */}
      <div className="bg-white p-5 rounded-2xl border border-border-light/35 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-neutral-light uppercase tracking-wider">
            Partner Active
          </p>
          <h3 className="text-sm font-bold text-neutral-dark mt-1">
            {partnerName}
          </h3>
        </div>

        <div className="relative">
          <img
            alt={partnerName}
            className="w-11 h-11 rounded-full object-cover border border-border-light/25 shadow-sm"
            src={partnerAvatar}
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-xs"></span>
        </div>
      </div>
    </div>
  );
};

export default ClassLeaderboardSidebar;
