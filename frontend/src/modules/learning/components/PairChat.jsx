import React from "react";
import { Notebook, FileText } from "lucide-react";
import { toast } from "sonner";

const PairChat = ({
    activeTab,
    onTabChange,
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
                        {materials && materials.length > 0 ? (
                            materials.map((file) => (
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
                            ))
                        ) : (
                            <p className="text-xs text-neutral-light">Không có tài liệu đi kèm.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PairChat;
