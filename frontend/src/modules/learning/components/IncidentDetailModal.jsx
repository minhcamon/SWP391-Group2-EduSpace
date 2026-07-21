import React from "react";
import { X, Calendar, User, ShieldAlert, Award, FileText } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const IncidentDetailModal = ({ 
  selectedIncidentId, 
  onClose, 
  isLoading, 
  detailData,
  getTypeLabel,
  getStatusBadge 
}) => {
  if (!selectedIncidentId) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={18} />
        </button>

        {isLoading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <span className="text-slate-500 text-xs font-semibold">Đang tải chi tiết sự cố...</span>
          </div>
        ) : detailData ? (
          <div className="p-6 md:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-850">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    #INC-{detailData.id.toString().padStart(4, "0")}
                  </span>
                  {getStatusBadge(detailData.status)}
                </div>
                <h3 className="text-lg font-black text-neutral-dark dark:text-white">
                  {getTypeLabel(detailData.incidentType)}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-200/45 dark:border-slate-750">
                <Calendar size={14} className="text-slate-400" />
                <span>
                  Gửi ngày: {new Date(detailData.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              </div>
            </div>

            {/* Reason description */}
            <div className="space-y-2">
              <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block">Chi tiết khiếu nại</span>
              <div className="bg-slate-50 dark:bg-slate-800/25 p-4 rounded-2xl border border-slate-150/40 dark:border-slate-800/60 text-sm text-neutral-dark dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {detailData.reason}
              </div>
            </div>

            {/* Dispute Rubrics comparison (if ASSIGNMENT_DISPUTE) */}
            {detailData.incidentType === "ASSIGNMENT_DISPUTE" && detailData.submissionTitle && (
              <div className="space-y-4 pt-2">
                <span className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award size={16} className="text-primary" />
                  Thông tin bài tập & Điểm số
                </span>
                
                <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bài viết luận / Bài giải</span>
                    <h4 className="text-sm font-bold text-neutral-dark dark:text-white mt-0.5">{detailData.submissionTitle}</h4>
                    <div className="bg-slate-50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-850 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-350 mt-2 max-h-36 overflow-y-auto whitespace-pre-wrap">
                      {detailData.submissionContent}
                    </div>
                  </div>

                  {/* Criteria scores list */}
                  {detailData.rubricCriteria && detailData.rubricCriteria.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Chi tiết tiêu chí chấm bài</span>
                      <div className="space-y-3 bg-slate-50/50 dark:bg-slate-850/20 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                        {detailData.rubricCriteria.map((c) => {
                          const isCorrected = detailData.status === "RESOLVED" && c.overrideScore !== null;
                          return (
                            <div key={c.id} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{c.criteriaName}</span>
                                <div className="flex items-center gap-1.5 font-bold">
                                  <span className={isCorrected ? "line-through text-slate-400" : "text-slate-650 dark:text-slate-300"}>
                                    {c.score}/{c.maxScore}đ
                                  </span>
                                  {isCorrected && (
                                    <span className="text-green-650 dark:text-green-400">
                                      → {c.overrideScore}/{c.maxScore}đ
                                    </span>
                                  )}
                                </div>
                              </div>
                              {/* Progress bar visual */}
                              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative">
                                <div 
                                  className={`h-full rounded-full transition-all ${isCorrected ? "bg-slate-300" : "bg-primary"}`}
                                  style={{ width: `${(c.score / c.maxScore) * 100}%` }}
                                ></div>
                                {isCorrected && (
                                  <div 
                                    className="h-full bg-green-500 rounded-full absolute top-0 left-0 transition-all"
                                    style={{ width: `${(c.overrideScore / c.maxScore) * 100}%` }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Reviewer comments */}
                  {detailData.reviewerComment && (
                    <div className="p-4 bg-slate-100/40 dark:bg-slate-800/10 rounded-xl border border-slate-100 dark:border-slate-850 text-xs">
                      <span className="font-bold text-slate-500 block mb-1">Nhận xét của bạn học đánh giá:</span>
                      <p className="text-slate-650 dark:text-slate-350 italic">"{detailData.reviewerComment}"</p>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* Evidence URL */}
            {detailData.evidenceUrl && (
              <div className="space-y-2">
                <span className="font-bold text-xs text-slate-400 uppercase tracking-wider block">Minh chứng đính kèm</span>
                <a 
                  href={detailData.evidenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-primary/5 border border-primary/10 px-3.5 py-2 rounded-lg cursor-pointer"
                >
                  <FileText size={14} />
                  Xem tài liệu minh chứng
                </a>
              </div>
            )}

            {/* Mentor Resolution Notes */}
            {(detailData.status === "RESOLVED" || detailData.status === "REJECTED" || detailData.resolutionNote) && (
              <div className="space-y-3 pt-2">
                <span className="font-bold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-amber-500" />
                  Phản hồi từ Mentor
                </span>
                <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-150/40 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                  {detailData.resolvedByName && (
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <User size={14} className="text-slate-400" />
                      <span>Mentor phụ trách: {detailData.resolvedByName}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Kết quả giải quyết</span>
                    <p className="text-sm text-neutral-dark dark:text-slate-300 mt-1 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                      {detailData.resolutionNote || "Không có ghi chú chi tiết từ mentor."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer action */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex justify-end">
              <Button
                onClick={onClose}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 font-bold rounded-xl px-6 py-2.5 h-auto text-xs cursor-pointer"
              >
                Đóng cửa sổ
              </Button>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default IncidentDetailModal;
