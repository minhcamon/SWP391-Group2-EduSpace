import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import usePairDetail from "../hooks/usePairDetail";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// Import relocated subcomponents
import PairProfileCard from "../components/mentor-pair/PairProfileCard";
import PairActivityHistory from "../components/mentor-pair/PairActivityHistory";
import PairInterventionForm from "../components/mentor-pair/PairInterventionForm";

const PairDetailPage = () => {
  const { id } = useParams();
  const {
    pairDetail,
    isLoading,
    msgContent,
    setMsgContent,
    isSending,
    handleSendMessage
  } = usePairDetail(id);

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
            <PairProfileCard
              student={pairDetail.student1}
              roleLabel="Học viên A"
              lastActive="Vừa xong"
              peerReviewCount="12 bài"
            />
            <PairProfileCard
              student={pairDetail.student2}
              roleLabel="Học viên B"
              lastActive={pairDetail.status === "SLOW" ? "3 ngày trước" : "1 giờ trước"}
              peerReviewCount="12 bài"
            />
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
          <PairActivityHistory status={pairDetail.status} />
        </div>

        {/* Right Column (3): Intervention Actions & Notes */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Quick Contact Form */}
          <PairInterventionForm
            msgContent={msgContent}
            setMsgContent={setMsgContent}
            isSending={isSending}
            onSubmit={handleSendMessage}
          />

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
