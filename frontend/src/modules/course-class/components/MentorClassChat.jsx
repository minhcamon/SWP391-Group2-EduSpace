import { Send } from "lucide-react";
import Avatar from "@/components/common/Avatar";

export const MentorClassChat = ({
  chatMessages = [],
  chatInput = "",
  setChatInput,
  onSendMessage,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-border-light/30 shadow-sm flex flex-col h-[400px]">
      <div className="p-4 border-b border-border-light/20 flex justify-between items-center bg-bg-base rounded-t-2xl">
        <div>
          <h3 className="text-xs font-bold text-neutral-dark">Class Quick Chat</h3>
          <p className="text-[9px] text-emerald-600 font-bold flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
            10 học viên hoạt động
          </p>
        </div>
      </div>

      {/* Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[280px]">
        {chatMessages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="text-[9px] bg-bg-card px-2.5 py-0.5 rounded text-neutral-light font-bold uppercase tracking-wider">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.isSelf ? "flex-row-reverse" : "items-start"}`}
            >
              {!msg.isSelf && (
                <Avatar
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-7 h-7 border border-border-light/20 shadow-sm"
                />
              )}
              <div className={`max-w-[75%] ${msg.isSelf ? "text-right" : ""}`}>
                <span className="text-[9px] text-neutral-light block px-1 mb-0.5">
                  {msg.sender} • {msg.time}
                </span>
                <div
                  className={`p-2.5 rounded-2xl text-xs ${
                    msg.isSelf
                      ? "bg-primary text-white rounded-tr-none text-left"
                      : "bg-bg-card text-neutral-dark rounded-tl-none text-left"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input form */}
      <form 
        onSubmit={onSendMessage}
        className="p-3 border-t border-border-light/20 flex gap-2 items-center bg-bg-base/30 rounded-b-2xl"
      >
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="grow bg-white border border-border-light/40 rounded-full px-3 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-hidden"
          placeholder="Nhắn tin cho cả lớp..."
        />
        <button
          type="submit"
          className="bg-primary text-white p-1.5 rounded-full hover:bg-primary/95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default MentorClassChat;
