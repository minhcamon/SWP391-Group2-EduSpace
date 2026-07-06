import React from "react";
import { MessageSquare, Send } from "lucide-react";

const ResultReview = ({
    partnerSubmission,
    rubricCriteria,
    estimatedBand,
    comments,
    newCommentText,
    setNewCommentText,
    newCommentCategory,
    setNewCommentCategory,
    handleAddComment
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
            {/* Left Main Area: Candidate Submission (Col-span 7) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-border-light/30 shadow-xs flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
                    <div className="flex items-center gap-3">
                        <img
                            src={partnerSubmission.partnerAvatar}
                            alt={partnerSubmission.partnerName}
                            className="w-11 h-11 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-base font-bold text-neutral-dark">
                                Bài viết của {partnerSubmission.partnerName}
                            </h2>
                            <p className="text-xs text-neutral-medium mt-0.5">
                                Đã nộp {partnerSubmission.timeAgo} • {partnerSubmission.wordCount} từ
                            </p>
                        </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-full">
                        Chế độ Đánh giá chéo
                    </span>
                </div>

                {/* Essay Content Canvas with Highlighted Errors & Hover Tooltips */}
                <div className="prose max-w-none text-sm leading-relaxed text-neutral-dark p-5 bg-bg-base/30 rounded-xl border border-border-light/20 min-h-[400px] flex flex-col gap-4 font-sans">
                    <p>
                        In contemporary society, the debate regarding whether individuals have become increasingly interdependent or more self-reliant remains contentious. While some argue that modern technological advancements have fostered a greater sense of independence, I firmly believe that the complexities of the modern world have actually deepened our reliance on one another.
                    </p>
                    <p>
                        On the one hand, proponents of increased independence often point to technological innovations as the primary catalyst. For instance, the advent of the internet allows individuals to access information, acquire skills, and even earn a living without leaving their homes.{" "}
                        <span className="relative group bg-emerald-100/70 border-b-2 border-emerald-500 px-1 py-0.5 rounded cursor-pointer hover:bg-emerald-200/90 transition-colors inline-block">
                            Furthermore, automated services
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-neutral-dark text-white text-[11px] p-2.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 leading-normal">
                                <strong className="text-emerald-400 block mb-0.5">Từ vựng tốt (Lexical Resource)</strong>
                                Sử dụng từ nối chuyển ý rất tự nhiên và chính xác.
                            </span>
                        </span>{" "}
                        and smart home devices have reduced the need for human assistance in daily chores. Consequently, individuals can theoretically exist in a state of relative isolation, leading to the perception of heightened self-reliance.
                    </p>
                    <p>
                        Conversely, I argue that this apparent independence is merely superficial, masking a profound underlying interdependence. The globalized economy dictates that the goods we consume daily are produced by a vast, interconnected network of international labor. A simple cup of coffee involves farmers in South America, shipping networks across oceans, and local baristas.{" "}
                        <span className="relative group bg-rose-100/70 border-b-2 border-rose-500 px-1 py-0.5 rounded cursor-pointer hover:bg-rose-200/90 transition-colors inline-block">
                            Moreover, the specialized nature of modern professions mean that we constantly rely on experts
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-neutral-dark text-white text-[11px] p-2.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-20 leading-normal">
                                <strong className="text-rose-400 block mb-0.5">Lỗi ngữ pháp (Grammar Error)</strong>
                                Lỗi hòa hợp chủ ngữ-động từ: "nature" (danh từ số ít) đi kèm với động từ "mean" (phải sửa thành "means").
                            </span>
                        </span>{" "}
                        in fields ranging from healthcare to IT infrastructure. When these complex systems fail, our dependency becomes starkly apparent.
                    </p>
                    <p>
                        In conclusion, although modern conveniences may create an illusion of self-sufficiency, the reality is far more intricate. The specialization and globalization inherent in modern society have unequivocally bound us closer together, making true independence a myth in the 21st century.
                    </p>
                </div>
            </div>

            {/* Right Sidebar: Grading Rubric & Feedback Comments (Col-span 3) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
                {/* Grading Rubric Display */}
                <div className="bg-white rounded-2xl p-5 border border-border-light/30 shadow-xs flex flex-col gap-4">
                    <h3 className="text-base font-bold text-neutral-dark border-b border-slate-100 pb-2 flex items-center gap-1.5">
                        Tiêu chí chấm điểm
                    </h3>
                    <div className="flex flex-col gap-4">
                        {rubricCriteria.map((criterion) => (
                            <div key={criterion.id} className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-medium font-semibold">{criterion.name}</span>
                                    <span className="text-primary font-bold">{criterion.score.toFixed(1)} / {criterion.max.toFixed(1)}</span>
                                </div>
                                <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary rounded-full"
                                        style={{ width: `${criterion.percent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-2 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-neutral-dark">Băng điểm ước tính</span>
                        <span className="text-lg font-extrabold text-secondary bg-secondary/10 px-3.5 py-1.5 rounded-xl border border-secondary/15">
                            {estimatedBand.toFixed(1)}
                        </span>
                    </div>
                </div>

                {/* Detailed Feedback Comments Panel */}
                <div className="bg-white rounded-2xl p-5 border border-border-light/30 shadow-xs flex-grow flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <h3 className="text-base font-bold text-neutral-dark">Nhận xét chi tiết</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-3">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className={`p-3 rounded-xl border-l-4 text-xs flex flex-col gap-1 ${comment.category === "grammar"
                                        ? "bg-rose-50/50 border-rose-500 border border-y-rose-100 border-r-rose-100"
                                        : "bg-emerald-50/50 border-emerald-500 border border-y-emerald-100 border-r-emerald-100"
                                    }`}
                            >
                                <span
                                    className={`font-bold block ${comment.category === "grammar" ? "text-rose-700" : "text-emerald-700"
                                        }`}
                                >
                                    {comment.type}
                                </span>
                                <p className="text-neutral-medium leading-relaxed font-sans">{comment.text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Feedback Input Box */}
                    <form onSubmit={handleAddComment} className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                        <div className="flex gap-2 text-xs">
                            <label className="sr-only">Loại tiêu chí</label>
                            <select
                                value={newCommentCategory}
                                onChange={(e) => setNewCommentCategory(e.target.value)}
                                className="w-full p-2 border border-border-light rounded-lg bg-bg-base/30 text-xs font-semibold text-neutral-medium outline-hidden focus:border-primary focus:bg-white"
                            >
                                <option value="Lexical Resource">Từ vựng (Lexical)</option>
                                <option value="Grammar">Ngữ pháp (Grammar)</option>
                                <option value="Coherence & Cohesion">Mạch lạc (Coherence)</option>
                                <option value="Task Response">Đáp ứng đề (Response)</option>
                            </select>
                        </div>
                        <textarea
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Viết nhận xét của bạn tại đây để góp ý cho bạn học..."
                            rows="3"
                            className="w-full p-3 border border-border-light rounded-xl bg-bg-base/30 text-xs outline-hidden focus:border-primary focus:bg-white transition-all resize-none leading-relaxed font-sans text-neutral-dark"
                        />
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                            <Send className="w-3.5 h-3.5" /> Gửi phản hồi
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResultReview;
