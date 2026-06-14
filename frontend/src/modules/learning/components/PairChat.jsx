import React from "react";
import { MessageSquare, Notebook, FileText, Send } from "lucide-react";
import { toast } from "sonner";

const PairChat = ({
    activeTab,
    onTabChange,
    messages,
    inputText,
    onInputChange,
    onSubmitMessage,
    sharedNotes,
    onNotesChange,
    materials,
    onDownloadMaterial
}) => {
    return (
        <div className="flex flex-col gap-4 mt-2">
            {/* Interactive Tabs Menu */}
            <div className="border-b border-border-light">
                <nav className="flex gap-6">
                    <button
                        onClick={() => onTabChange("chat")}
                        className={`py-3 px-1 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                            activeTab === "chat"
                                ? "border-primary text-primary"
                                : "border-transparent text-neutral-medium hover:text-neutral-dark"
                        }`}
                    >
                        <MessageSquare size={16} />
                        Trò chuyện cặp
                    </button>
                    <button
                        onClick={() => onTabChange("notes")}
                        className={`py-3 px-1 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                            activeTab === "notes"
                                ? "border-primary text-primary"
                                : "border-transparent text-neutral-medium hover:text-neutral-dark"
                        }`}
                    >
                        <Notebook size={16} />
                        Ghi chú chung
                    </button>
                    <button
                        onClick={() => onTabChange("materials")}
                        className={`py-3 px-1 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                            activeTab === "materials"
                                ? "border-primary text-primary"
                                : "border-transparent text-neutral-medium hover:text-neutral-dark"
                        }`}
                    >
                        <FileText size={16} />
                        Tài liệu ({materials.length})
                    </button>
                </nav>
            </div>

            {/* Tab Content Panel */}
            <div className="min-h-[250px] bg-slate-50/50 p-4 rounded-xl border border-border-light/40">
                {activeTab === "chat" && (
                    <div className="flex flex-col h-full justify-between gap-4">
                        {/* Message List */}
                        <div className="grow space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-3 ${
                                        msg.isMe ? "flex-row-reverse" : "flex-row"
                                    }`}
                                >
                                    {!msg.isMe && (
                                        <img
                                            className="w-8 h-8 rounded-full object-cover shrink-0"
                                            src={msg.avatar}
                                            alt={msg.sender}
                                        />
                                    )}
                                    {msg.isMe && (
                                        <div className="w-8 h-8 rounded-full bg-sky-100 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                                            ME
                                        </div>
                                    )}
                                    <div className={`max-w-[75%] ${msg.isMe ? "items-end" : "items-start"}`}>
                                        <div
                                            className={`p-3 rounded-2xl shadow-sm text-sm ${
                                                msg.isMe
                                                    ? "bg-primary text-white rounded-tr-none"
                                                    : "bg-white text-neutral-dark rounded-tl-none border border-border-light/35"
                                            }`}
                                        >
                                            {msg.videoTime && (
                                                <span className="text-sky-500 font-bold hover:underline cursor-pointer mr-1.5">
                                                    @{msg.videoTime}
                                                </span>
                                            )}
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] text-neutral-light mt-1 block px-1">
                                            {msg.sender} • {msg.timestamp}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Form */}
                        <form
                            onSubmit={onSubmitMessage}
                            className="flex gap-2 p-2 bg-white rounded-xl border border-border-light focus-within:border-primary transition-all"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={onInputChange}
                                placeholder="Gửi tin nhắn hoặc dùng '@' để đính kèm mốc thời gian..."
                                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none border-none focus:ring-0"
                            />
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary/90 text-white p-2.5 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "notes" && (
                    <div className="flex flex-col gap-3 h-full">
                        <textarea
                            value={sharedNotes}
                            onChange={onNotesChange}
                            rows={8}
                            className="w-full p-4 bg-white rounded-xl border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm font-mono leading-relaxed"
                            placeholder="Nhập ghi chú chung của nhóm tại đây..."
                        />
                        <div className="flex justify-between items-center text-xs text-neutral-light">
                            <span>Tự động đồng bộ thời gian thực...</span>
                            <button
                                type="button"
                                onClick={() => toast.success("Đã xuất ghi chú thành công!")}
                                className="text-primary font-bold hover:underline cursor-pointer"
                            >
                                Xuất File PDF
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "materials" && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-neutral-medium uppercase tracking-wider mb-2">
                            Tài liệu đi kèm bài học
                        </h4>
                        {materials.map((file) => (
                            <div
                                key={file.id}
                                className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-border-light/35 hover:border-primary transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-lg text-neutral-medium">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-dark truncate max-w-xs sm:max-w-md">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-neutral-light">{file.size}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onDownloadMaterial(file)}
                                    className="text-sm font-bold text-primary hover:underline cursor-pointer"
                                >
                                    Tải về
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PairChat;
