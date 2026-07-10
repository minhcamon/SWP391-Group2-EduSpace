import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, User, Calendar, BookOpen, Scale, CheckCircle, Award } from "lucide-react";
import mentorService from "@/services/mentorService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const ArbitrationDetailPage = () => {
  const { id } = useParams();
  const [arbitration, setArbitration] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [finalScore, setFinalScore] = useState("");
  const [mentorComment, setMentorComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchArbitrationDetail = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getArbitrationById(id);
        setArbitration(data);
        if (data.status === "RESOLVED") {
          setFinalScore(data.finalScore || "");
          setMentorComment(data.comment || "");
        }
      });
    } catch (err) {
      toast.error(err.message || "Không thể tải thông tin khiếu nại chấm điểm!");
    }
  };

  useEffect(() => {
    fetchArbitrationDetail();
  }, [id]);

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    const scoreVal = parseFloat(finalScore);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      toast.error("Vui lòng nhập điểm số hợp lệ từ 0 đến 10!");
      return;
    }
    if (!mentorComment.trim()) {
      toast.error("Vui lòng nhập nhận xét/đánh giá chi tiết của Mentor!");
      return;
    }

    try {
      await runWithLoading(setIsSubmitting, async () => {
        await mentorService.submitArbitrationGrade(id, scoreVal, mentorComment);
        toast.success("Đã hoàn tất phân xử điểm thành công!");
        fetchArbitrationDetail();
      });
    } catch (err) {
      toast.error(err.message || "Lỗi khi nộp kết quả phân xử!");
    }
  };

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
        return null;
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
                Mã đơn: {arbitration.id}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                Phân xử: {arbitration.assignmentTitle}
              </h1>
              {getStatusBadge(arbitration.status)}
              <span className="bg-red-50 text-red-600 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-red-200">
                Chênh lệch: {arbitration.difference} điểm
              </span>
            </div>
            <p className="text-sm text-neutral-medium mt-1.5">
              Học viên nộp bài: <span className="font-bold text-neutral-dark">{arbitration.learnerName}</span> | Lớp học:{" "}
              <span className="font-bold text-neutral-dark">{arbitration.className}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout 7:3 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column (7): Student submission text, Reviewers scores, Rubrics */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Submission content */}
          <Card className="border border-border-light/35 shadow-sm">
            <CardHeader className="border-b border-border-light/20 pb-4">
              <CardTitle className="text-base font-bold text-neutral-dark">Nội dung bài làm của học viên</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono text-sm leading-relaxed text-neutral-dark whitespace-pre-wrap">
                {arbitration.submissionContent}
              </div>
            </CardContent>
          </Card>

          {/* Peer reviews comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reviewer A */}
            <Card className="border border-border-light/35 shadow-sm">
              <CardHeader className="border-b border-border-light/20 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-neutral-medium">Học viên chấm chéo A</CardTitle>
                <span className="text-lg font-extrabold text-primary">{arbitration.reviewerAScore}/10</span>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-xs text-neutral-light font-bold mb-1.5 uppercase tracking-wide">Nhận xét của A</p>
                <p className="text-sm text-neutral-dark leading-relaxed font-semibold italic bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  "{arbitration.reviewerAComment}"
                </p>
              </CardContent>
            </Card>

            {/* Reviewer B */}
            <Card className="border border-border-light/35 shadow-sm">
              <CardHeader className="border-b border-border-light/20 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-neutral-medium">Học viên chấm chéo B</CardTitle>
                <span className="text-lg font-extrabold text-primary">{arbitration.reviewerBScore}/10</span>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-xs text-neutral-light font-bold mb-1.5 uppercase tracking-wide">Nhận xét của B</p>
                <p className="text-sm text-neutral-dark leading-relaxed font-semibold italic bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  "{arbitration.reviewerBComment}"
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rubric guidelines for this task */}
          {arbitration.rubric && (
            <Card className="border border-border-light/35 shadow-sm">
              <CardHeader className="border-b border-border-light/20 pb-4">
                <CardTitle className="text-base font-bold text-neutral-dark">Rubric tiêu chí chấm điểm tham chiếu</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {Object.entries(arbitration.rubric).map(([key, val]) => (
                  <div key={key} className="text-xs border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                    <span className="font-bold text-neutral-dark uppercase tracking-wider block mb-1">
                      {key === "fluency"
                        ? "Trôi chảy (Fluency)"
                        : key === "vocabulary" || key === "lexicalResource"
                        ? "Từ vựng (Vocabulary / Lexical)"
                        : key === "grammar" || key === "grammaticalRange"
                        ? "Ngữ pháp (Grammar)"
                        : key === "pronunciation"
                        ? "Phát âm (Pronunciation)"
                        : "Tiêu chí chính (Task Achievement)"}
                    </span>
                    <p className="text-neutral-medium font-semibold">{val}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
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
                      placeholder="Giải thích rõ quyết định điểm số dựa trên Rubric chuẩn..."
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
                      <Award size={14} />
                      Điểm quyết định cuối cùng: <span className="font-bold text-base text-primary">{arbitration.finalScore}/10</span>
                    </p>
                    {arbitration.comment && (
                      <div className="bg-white border border-emerald-100 p-3 rounded-xl text-neutral-dark italic font-semibold">
                        " {arbitration.comment} "
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
