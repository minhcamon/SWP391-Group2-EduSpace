import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const MentorBroadcast = ({
  announcementText = "",
  setAnnouncementText,
  onBroadcast,
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-border-light/30 shadow-sm relative overflow-hidden">
      <h3 className="text-sm font-bold text-neutral-dark mb-4 flex items-center gap-2">
        <Megaphone className="w-4 h-4 text-secondary" />
        Thông báo từ Mentor
      </h3>
      
      <form onSubmit={onBroadcast} className="space-y-3">
        <textarea
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full bg-bg-base/40 border border-border-light/45 rounded-xl p-3 text-xs focus:ring-1 focus:ring-secondary outline-hidden text-neutral-dark resize-none h-24"
          placeholder="Thông báo nội dung bài học, nhắc nhở hạn chót cho cả lớp..."
        />
        <p className="text-[10px] text-neutral-light italic">
          Nội dung sẽ được gửi tới toàn bộ 10 học viên
        </p>
        <Button
          type="submit"
          className="w-full py-4 bg-secondary hover:bg-secondary/95 text-white font-bold text-xs shadow-md cursor-pointer"
        >
          Gửi thông báo
        </Button>
      </form>
    </div>
  );
};

export default MentorBroadcast;
