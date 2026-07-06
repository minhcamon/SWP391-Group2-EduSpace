import React from "react";
import { Clock, Users, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

const AssignmentWork = ({
    assignmentDetails,
    essay,
    handleEssayChange,
    isSubmitted,
    wordCount,
    handleSubmitDraft,
    isSubmitting,
    partner,
    timeRemaining
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left side: Essay Input Form (Col-span 6) */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col gap-5">
                <h2 className="text-lg font-bold text-neutral-dark border-b border-slate-100 pb-2">
                    Đề bài IELTS Writing
                </h2>
                <div className="bg-bg-base/70 p-4 rounded-xl border border-border-light/20">
                    <p className="text-sm text-neutral-medium font-medium leading-relaxed">
                        <strong>Prompt:</strong> {assignmentDetails?.prompt}
                    </p>
                </div>

                <div className="flex-grow flex flex-col gap-2 mt-2">
                    <label htmlFor="essay-textarea" className="text-sm font-bold text-neutral-dark">
                        Bài viết của bạn
                    </label>
                    <textarea
                        id="essay-textarea"
                        value={essay}
                        onChange={handleEssayChange}
                        readOnly={isSubmitted}
                        placeholder="Bắt đầu nhập nội dung bài luận IELTS Writing Task 2 của bạn tại đây (ít nhất 250 từ)..."
                        className={`w-full min-h-[320px] p-4 bg-bg-base/30 border rounded-xl outline-hidden focus:ring-1 focus:ring-primary focus:bg-white transition-all text-sm leading-relaxed text-neutral-dark font-sans ${isSubmitted ? "bg-slate-50 cursor-not-allowed border-slate-200" : "border-border-light/60 focus:border-primary"
                            }`}
                    />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-xs text-neutral-medium font-semibold">
                        Số lượng từ: <strong className={wordCount >= 250 ? "text-success" : "text-secondary"}>{wordCount}</strong> / 250+ từ
                    </span>
                    <Button
                        onClick={handleSubmitDraft}
                        isLoading={isSubmitting}
                        disabled={isSubmitted}
                        className="bg-primary hover:bg-primary/95 text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer hover:scale-[1.01] transition-all"
                    >
                        {isSubmitted ? "Đã nộp bài nháp" : "Nộp bài viết"}
                    </Button>
                </div>
            </div>

            {/* Right side: Partner Progress & Motivation Card (Col-span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Partner Progress Widget */}
                <div className="bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col gap-5">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Users className="w-5 h-5 text-primary" />
                        <h2 className="text-lg font-bold text-neutral-dark">Tiến trình bạn cùng tiến</h2>
                    </div>

                    <div className="bg-bg-base/40 rounded-xl p-5 border border-border-light/20 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={partner.avatar}
                                alt={partner.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-primary-container"
                            />
                            <div>
                                <h3 className="text-sm font-bold text-neutral-dark">{partner.name}</h3>
                                <p className="text-xs text-neutral-medium mt-0.5">Bạn đồng hành lớp học</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs font-bold">
                                <span className="text-neutral-medium">{partner.statusText}</span>
                                <span className="text-primary">{partner.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-secondary rounded-full transition-all duration-500"
                                    style={{ width: `${partner.progress}%` }}
                                />
                            </div>
                        </div>

                        <div className="mt-2 p-3 bg-white rounded-lg border border-slate-100 flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <p className="text-xs text-neutral-medium leading-relaxed">
                                {partner.detail}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Motivational Countdown Widget */}
                <div className="bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex-grow flex items-center justify-center relative overflow-hidden min-h-[200px]">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
                    <div className="text-center z-10 flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Clock className="w-6 h-6 animate-pulse" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-dark">Giữ sự tập trung hoàn thành bài viết!</h3>
                        <p className="text-xs text-neutral-medium">
                            Thời gian làm bài còn lại ước tính khoảng <strong className="text-primary">{timeRemaining} phút</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignmentWork;
