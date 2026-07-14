import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Scale, CheckCircle, Calendar, User, FileText } from "lucide-react";
import useArbitrationDetail from "../hooks/useArbitrationDetail";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const ArbitrationDetailPage = () => {
    const { id } = useParams();
    const {
        arbitration,
        isLoading,
        finalScore,
        setFinalScore,
        mentorComment,
        setMentorComment,
        isSubmitting,
        handleSubmitGrade
    } = useArbitrationDetail(id);

    if (isLoading) {
        return (
            <div className="grow flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!arbitration) {
        return (
            <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
                <h2 className="text-xl font-bold text-neutral-dark mb-2">Không tìm thấy yêu cầu phân xử</h2>
                <Link to="/mentor/arbitrations" className="text-primary hover:underline text-sm font-semibold">
                    Quay lại danh sách phân xử
                </Link>
            </div>
        );
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case "PENDING":
                return <Badge variant="pending" className="font-bold text-[10px] uppercase">Đang chờ</Badge>;
            case "RESOLVED":
                return <Badge variant="approved" className="font-bold text-[10px] uppercase">Đã giải quyết</Badge>;
            default:
                return <Badge variant="outline" className="font-bold text-[10px] uppercase">{status}</Badge>;
        }
    };

    return (
        <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Back button & Header */}
            <div className="mb-6">
                <Link
                    to="/mentor/arbitrations"
                    className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold mb-4 transition-colors duration-200"
                >
                    <ArrowLeft size={16} />
                    <span>Quay lại Phân xử Điểm</span>
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-bold text-neutral-light bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                Mã đơn: #{arbitration.id}
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                                Phân xử: {arbitration.submissionTitle}
                            </h1>
                            {getStatusBadge(arbitration.status)}
                        </div>
                        <p className="text-sm text-neutral-medium mt-1.5">
                            Học viên nộp bài: <span className="font-bold text-neutral-dark">{arbitration.reporterName}</span> | Lớp học:{" "}
                            <span className="font-bold text-neutral-dark">{arbitration.className}</span> | Khóa học:{" "}
                            <span className="font-bold text-neutral-dark">{arbitration.courseTitle}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Layout 7:3 */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* Left Column (7): Detailed Incident / Arbitration Info */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                    <Card className="border border-border-light/35 shadow-sm">
                        <CardHeader className="border-b border-border-light/20 pb-4">
                            <CardTitle className="text-base font-bold text-neutral-dark">Thông tin yêu cầu phân xử</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-2.5">
                                    <User className="text-neutral-light mt-0.5 shrink-0" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-neutral-medium uppercase tracking-wide block">Người khiếu nại</span>
                                        <span className="text-sm font-semibold text-neutral-dark">{arbitration.reporterName}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <User className="text-neutral-light mt-0.5 shrink-0" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-neutral-medium uppercase tracking-wide block">Người bị khiếu nại</span>
                                        <span className="text-sm font-semibold text-neutral-dark">{arbitration.reportedName || "Hệ thống"}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 col-span-1 md:col-span-2">
                                    <Calendar className="text-neutral-light mt-0.5 shrink-0" size={16} />
                                    <div>
                                        <span className="text-xs font-bold text-neutral-medium uppercase tracking-wide block">Ngày tạo yêu cầu</span>
                                        <span className="text-sm font-semibold text-neutral-dark">
                                            {arbitration.createdAt ? new Date(arbitration.createdAt).toLocaleString("vi-VN") : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-border-light/25" />

                            <div>
                                <span className="text-xs font-bold text-neutral-medium uppercase tracking-wide block mb-1.5">Lý do khiếu nại</span>
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm leading-relaxed text-neutral-dark font-semibold whitespace-pre-wrap">
                                    {arbitration.reason || "Không có lý do chi tiết."}
                                </div>
                            </div>

                            {arbitration.evidenceUrl && (
                                <div className="pt-2">
                                    <span className="text-xs font-bold text-neutral-medium uppercase tracking-wide block mb-1.5">Minh chứng đính kèm</span>
                                    <a
                                        href={arbitration.evidenceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-border-light/65 rounded-xl text-sm font-bold text-primary hover:bg-slate-50 transition-all cursor-pointer"
                                    >
                                        <FileText size={16} />
                                        <span>Xem minh chứng khiếu nại</span>
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column (3): Final grading form */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    {arbitration.status === "PENDING" ? (
                        <Card className="border border-border-light/35 shadow-sm bg-slate-50">
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-neutral-dark">Nhập điểm phán quyết</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmitGrade} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-neutral-medium mb-1.5 uppercase tracking-wide">
                                            Điểm phán quyết (Thang 10)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            max="10"
                                            value={finalScore}
                                            onChange={(e) => setFinalScore(e.target.value)}
                                            placeholder="Ví dụ: 7.5"
                                            className="w-full p-2.5 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary font-bold text-neutral-dark bg-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-neutral-medium mb-1.5 uppercase tracking-wide">
                                            Nhận xét phân định của Mentor
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={mentorComment}
                                            onChange={(e) => setMentorComment(e.target.value)}
                                            placeholder="Giải thích rõ quyết định điểm số..."
                                            className="w-full p-3 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary resize-none bg-white font-semibold"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <Scale size={14} />
                                        <span>{isSubmitting ? "Đang xử lý..." : "Nộp kết quả phân xử"}</span>
                                    </button>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border border-emerald-200 bg-emerald-50 text-emerald-950 p-5 shadow-sm">
                            <div className="flex gap-2">
                                <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h4 className="font-bold text-sm text-emerald-800">Đơn đã được giải quyết</h4>
                                    <div className="mt-3 space-y-2 text-xs">
                                        <p className="font-semibold text-emerald-900 flex items-center gap-1">
                                            <Scale size={14} />
                                            Người phân định: <span className="font-bold text-neutral-dark">{arbitration.resolvedByName || "Mentor"}</span>
                                        </p>
                                        {arbitration.solvedAt && (
                                            <p className="font-semibold text-emerald-900 flex items-center gap-1">
                                                <Calendar size={14} />
                                                Ngày giải quyết: <span className="font-bold text-neutral-dark">
                                                    {new Date(arbitration.solvedAt).toLocaleDateString("vi-VN")}
                                                </span>
                                            </p>
                                        )}
                                        {arbitration.resolutionNote && (
                                            <div className="bg-white border border-emerald-100 p-3 rounded-xl text-neutral-dark italic font-semibold mt-2">
                                                "{arbitration.resolutionNote}"
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArbitrationDetailPage;
