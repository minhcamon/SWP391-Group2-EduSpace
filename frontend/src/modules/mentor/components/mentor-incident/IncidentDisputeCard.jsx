import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { FileText, Award, MessageSquare, ListTodo } from "lucide-react";

const IncidentDisputeCard = ({ incident }) => {
    if (!incident || incident.incidentType !== "ASSIGNMENT_DISPUTE" || !incident.submissionTitle) return null;

    return (
        <Card className="border border-border-light/35 shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-border-light/20 pb-4 bg-linear-to-r from-primary/5 to-transparent">
                <CardTitle className="text-base font-bold text-neutral-dark flex items-center gap-2">
                    <ListTodo size={18} className="text-primary" />
                    <span>Chi tiết tranh chấp & Đánh giá bài nộp</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6 text-sm">
                {/* Assignment and Score */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-light/10 p-4 rounded-xl border border-border-light/20">
                    <div>
                        <span className="text-xs font-semibold text-neutral-medium uppercase tracking-wider">Tên bài tập</span>
                        <h4 className="font-bold text-neutral-dark text-base mt-0.5">{incident.submissionTitle}</h4>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-lg border border-border-light/30 shadow-xs shrink-0">
                        <Award size={18} className="text-secondary" />
                        <div>
                            <p className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider">Điểm số ban đầu</p>
                            <p className="text-base font-extrabold text-red-500">
                                {incident.scoreGiven !== null ? incident.scoreGiven : "Chưa chấm"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Student Submission content */}
                <div className="space-y-2">
                    <h5 className="font-bold text-neutral-dark flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-medium">
                        <FileText size={14} className="text-primary" />
                        Nội dung bài nộp của học viên
                    </h5>
                    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 font-mono text-xs leading-relaxed text-neutral-dark whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                        {incident.submissionContent || <span className="italic text-neutral-medium">Không có nội dung văn bản</span>}
                    </div>
                </div>

                {/* Peer reviewer details */}
                {incident.reviewerComment && (
                    <div className="space-y-2">
                        <h5 className="font-bold text-neutral-dark flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-medium">
                            <MessageSquare size={14} className="text-primary" />
                            Nhận xét ban đầu của Người chấm (Peer Reviewer)
                        </h5>
                        <div className="bg-neutral-light/5 border border-border-light/25 rounded-xl p-4 text-xs text-neutral-dark italic leading-relaxed">
                            "{incident.reviewerComment}"
                        </div>
                    </div>
                )}

                {/* Rubric Criteria Breakdown */}
                {incident.rubricCriteria && incident.rubricCriteria.length > 0 && (
                    <div className="space-y-4">
                        <h5 className="font-bold text-neutral-dark text-xs uppercase tracking-wider text-neutral-medium">
                            Chi tiết tiêu chí chấm điểm
                        </h5>
                        <div className="space-y-3">
                            {incident.rubricCriteria.map((crit, idx) => {
                                const percentage = crit.maxPoint > 0 ? (crit.score / crit.maxPoint) * 100 : 0;
                                return (
                                    <div key={idx} className="space-y-1.5 p-3 rounded-lg border border-border-light/10 hover:bg-neutral-light/5 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <p className="font-bold text-neutral-dark text-xs">{crit.criteriaName}</p>
                                                {crit.description && (
                                                    <p className="text-[11px] text-neutral-medium mt-0.5">{crit.description}</p>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-neutral-dark shrink-0">
                                                {crit.score} / {crit.maxPoint} đ
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-300"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default IncidentDisputeCard;
