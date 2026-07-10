import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, MessageSquare, ShieldAlert, Award, Calendar, ExternalLink } from "lucide-react";
import mentorService from "@/services/mentorService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const PairDetailPage = () => {
  const { id } = useParams();
  const [pairDetail, setPairDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [msgContent, setMsgContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchPairDetail = async () => {
      try {
        await runWithLoading(setIsLoading, async () => {
          const data = await mentorService.getPairById(id);
          setPairDetail(data);
        });
      } catch (err) {
        toast.error(err.message || "Không tìm thấy thông tin cặp đôi học tập!");
      }
    };
    fetchPairDetail();
  }, [id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgContent.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      toast.success("Đã gửi tin nhắn nhắc nhở/cảnh báo tới cả hai học viên!");
      setMsgContent("");
      setIsSending(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!pairDetail) {
    return (
      <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-neutral-dark mb-2">Không tìm thấy cặp đôi học tập</h2>
        <Link to="/mentor/classes" className="text-primary hover:underline text-sm font-semibold">
          Quay lại quản lý lớp học
        </Link>
      </div>
    );
  }

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button & Header */}
      <div className="mb-6">
        <Link
          to={`/mentor/classes`}
          className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Quay lại chi tiết lớp</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                Chi tiết Cặp đôi: {pairDetail.student1.name} & {pairDetail.student2.name}
              </h1>
              <Badge
                variant={pairDetail.status === "SLOW" ? "destructive" : "approved"}
                className="font-bold tracking-wider text-[10px]"
              >
                {pairDetail.status === "SLOW" ? "Học chậm (Slow)" : "Hoạt động tốt"}
              </Badge>
            </div>
            <p className="text-sm text-neutral-medium mt-1">
              Phân thuộc Lớp học: <span className="font-semibold text-neutral-dark">{pairDetail.className}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid 7:3 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column (7): Partner Details & Activity */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Pair Profiles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student 1 */}
            <Card className="border border-border-light/35 shadow-sm">
              <CardContent className="p-6 text-center">
                <img
                  src={pairDetail.student1.avatar}
                  alt={pairDetail.student1.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary/20 mb-4 bg-slate-100 shadow-sm"
                />
                <h3 className="font-bold text-neutral-dark text-lg">{pairDetail.student1.name}</h3>
                <p className="text-xs text-neutral-light font-semibold mb-3">Học viên A</p>
                <div className="text-xs text-left bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Hoạt động cuối:</span>
                    <span className="font-semibold text-neutral-dark">Vừa xong</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Số bài đánh giá chéo:</span>
                    <span className="font-semibold text-neutral-dark">12 bài</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student 2 */}
            <Card className="border border-border-light/35 shadow-sm">
              <CardContent className="p-6 text-center">
                <img
                  src={pairDetail.student2.avatar}
                  alt={pairDetail.student2.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-primary/20 mb-4 bg-slate-100 shadow-sm"
                />
                <h3 className="font-bold text-neutral-dark text-lg">{pairDetail.student2.name}</h3>
                <p className="text-xs text-neutral-light font-semibold mb-3">Học viên B</p>
                <div className="text-xs text-left bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Hoạt động cuối:</span>
                    <span className="font-semibold text-neutral-dark">
                      {pairDetail.status === "SLOW" ? "3 ngày trước" : "1 giờ trước"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-medium">Số bài đánh giá chéo:</span>
                    <span className="font-semibold text-neutral-dark">12 bài</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Metrics & Progress */}
          <Card className="border border-border-light/35 shadow-sm">
            <CardHeader className="border-b border-border-light/20 pb-4">
              <CardTitle className="text-base font-bold text-neutral-dark">Tiến trình & Sự ăn ý (Harmony Metrics)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-neutral-medium mb-2">
                  <span>Tiến độ chương trình học của cặp</span>
                  <span className="text-neutral-dark font-extrabold">{pairDetail.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      pairDetail.status === "SLOW" ? "bg-red-500" : "bg-primary"
                    }`}
                    style={{ width: `${pairDetail.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-neutral-medium font-semibold">Tỷ lệ tương tác</p>
                  <p className="text-xl font-bold text-neutral-dark mt-1">
                    {pairDetail.status === "SLOW" ? "35%" : "92%"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-medium font-semibold">Phản hồi trung bình</p>
                  <p className="text-xl font-bold text-neutral-dark mt-1">
                    {pairDetail.status === "SLOW" ? "> 24 giờ" : "1.5 giờ"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-neutral-medium font-semibold">Tương thích mục tiêu</p>
                  <p className="text-xl font-bold text-neutral-dark mt-1">Cao</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline of interactions */}
          <Card className="border border-border-light/35 shadow-sm">
            <CardHeader className="border-b border-border-light/20 pb-4">
              <CardTitle className="text-base font-bold text-neutral-dark">Lịch sử tương tác gần nhất</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
                <div className="relative">
                  <span className="absolute left-[-31px] top-0 bg-primary text-white p-1 rounded-full">
                    <Award size={10} />
                  </span>
                  <p className="text-xs font-semibold text-neutral-medium">Hôm qua</p>
                  <h4 className="font-bold text-neutral-dark text-sm mt-0.5">Hoàn thành Milestone 1</h4>
                  <p className="text-xs text-neutral-medium mt-0.5">Cả hai đã nộp bài tập chấm chéo Milestone 1 và hoàn tất cho điểm nhau.</p>
                </div>

                <div className="relative">
                  <span className="absolute left-[-31px] top-0 bg-amber-500 text-white p-1 rounded-full">
                    <MessageSquare size={10} />
                  </span>
                  <p className="text-xs font-semibold text-neutral-medium">3 ngày trước</p>
                  <h4 className="font-bold text-neutral-dark text-sm mt-0.5">Thảo luận bài tập nhóm</h4>
                  <p className="text-xs text-neutral-medium mt-0.5">Học viên A nhắn tin nhắc học viên B hoàn thiện phần mở bài IELTS Writing.</p>
                </div>

                {pairDetail.status === "SLOW" && (
                  <div className="relative">
                    <span className="absolute left-[-31px] top-0 bg-red-500 text-white p-1 rounded-full">
                      <ShieldAlert size={10} />
                    </span>
                    <p className="text-xs font-semibold text-neutral-medium">3 ngày trước</p>
                    <h4 className="font-bold text-red-600 text-sm mt-0.5">Cảnh báo vắng mặt tự động</h4>
                    <p className="text-xs text-neutral-medium mt-0.5">Học viên B không đăng nhập vào hệ thống học tập quá 72 giờ.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (3): Intervention Actions & Notes */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Quick Contact Form */}
          <Card className="border border-border-light/35 shadow-sm bg-slate-50">
            <CardHeader>
              <CardTitle className="text-base font-bold text-neutral-dark">Hành động can thiệp (Intervention)</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-medium mb-1.5 uppercase tracking-wide">
                    Thông điệp gửi cặp đôi
                  </label>
                  <textarea
                    rows={4}
                    value={msgContent}
                    onChange={(e) => setMsgContent(e.target.value)}
                    placeholder="Nhập nội dung nhắc nhở, cảnh báo hoặc hỗ trợ..."
                    className="w-full p-3 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary bg-white resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-sm active:scale-98 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>{isSending ? "Đang gửi..." : "Gửi thông điệp"}</span>
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Quick info / Warning panel */}
          {pairDetail.status === "SLOW" && (
            <Card className="border border-red-200 bg-red-50 text-red-900 shadow-sm p-5">
              <div className="flex gap-2">
                <ShieldAlert className="text-red-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-sm text-red-800">Cần cứu trợ ngay!</h4>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    Cặp đôi này đang ở trạng thái học chậm. Học viên B cần phản hồi kịp thời để tránh bị hệ thống đình chỉ hoặc chuyển trạng thái sang Broken Pair.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PairDetailPage;
