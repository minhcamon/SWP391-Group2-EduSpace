import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ShieldAlert, Play, CheckCircle } from "lucide-react";
import useIncidentDetail from "../hooks/useIncidentDetail";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// Import relocated components
import IncidentReportCard from "../components/mentor-incident/IncidentReportCard";
import IncidentDisputeCard from "../components/mentor-incident/IncidentDisputeCard";
import IncidentHistoryLog from "../components/mentor-incident/IncidentHistoryLog";

const IncidentDetailPage = () => {
  const { id } = useParams();
  const {
    incident,
    isLoading,
    resolutionText,
    setResolutionText,
    isSubmitting,
    handleClaim,
    handleResolve
  } = useIncidentDetail(id);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="pending" className="font-bold text-[10px] uppercase">Chờ xử lý</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="roletag" className="bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-200">Đang xử lý</Badge>;
      case "RESOLVED":
        return <Badge variant="approved" className="font-bold text-[10px] uppercase">Đã giải quyết</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="font-bold text-[10px] uppercase">Đã từ chối</Badge>;
      case "CLOSED":
        return <Badge variant="outline" className="font-bold text-[10px] uppercase bg-slate-100 text-neutral-medium">Đã đóng</Badge>;
      default:
        return <Badge variant="outline" className="font-bold text-[10px] uppercase">{status}</Badge>;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "PEER_REVIEW_DISPUTE":
        return "Tranh chấp chấm chéo";
      case "INACTIVE_PARTNER":
        return "Bạn học không hoạt động";
      case "MEMBER_CONFLICT":
        return "Xung đột thành viên";
      case "RESCUE_SUPPORT_REQUEST":
        return "Yêu cầu cứu trợ";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-neutral-dark mb-2">Không tìm thấy sự cố</h2>
        <Link to="/mentor/incidents" className="text-primary hover:underline text-sm font-semibold">
          Quay lại Trung tâm Sự cố
        </Link>
      </div>
    );
  }

  const historyData = [];
  if (incident.createdAt) {
    historyData.push({
      id: 1,
      time: new Date(incident.createdAt).toLocaleString("vi-VN"),
      action: `Học viên ${incident.reporterName || ""} gửi báo cáo sự cố`
    });
  }
  if (incident.solvedAt) {
    historyData.push({
      id: 2,
      time: new Date(incident.solvedAt).toLocaleString("vi-VN"),
      action: `Mentor ${incident.resolvedByName || ""} giải quyết sự cố: ${incident.resolutionNote || ""}`
    });
  } else if (incident.status === "IN_PROGRESS") {
    historyData.push({
      id: 2,
      time: "",
      action: `Mentor đang tiếp nhận xử lý sự cố`
    });
  }

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button & Header */}
      <div className="mb-6">
        <Link
          to="/mentor/incidents"
          className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Quay lại Trung tâm Sự cố</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-neutral-light bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                Mã sự cố: {incident.id}
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                {getTypeLabel(incident.incidentType)}
              </h1>
              {getStatusBadge(incident.status)}
            </div>
            <p className="text-sm text-neutral-medium mt-1">
              Người báo cáo: <span className="font-bold text-neutral-dark">{incident.reporterName}</span>
              {incident.reportedName && (
                <>
                  {" "}| Đối tượng bị báo cáo: <span className="font-bold text-neutral-dark">{incident.reportedName}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid 7:3 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column (7): Incident details, evidence, history */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <IncidentReportCard incident={incident} />
          <IncidentDisputeCard incident={incident} />
          <IncidentHistoryLog history={historyData} />
        </div>

        {/* Right Column (3): Resolve / Claim Actions */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {incident.status === "PENDING" && (
            <Card className="border border-primary/20 bg-primary/5 text-center p-6">
              <ShieldAlert className="mx-auto text-primary mb-3" size={32} />
              <h4 className="font-bold text-neutral-dark text-base mb-1">Sự cố đang Chờ xử lý</h4>
              <p className="text-xs text-neutral-medium mb-4 leading-relaxed">
                Nhận xử lý sự cố để chuyển trạng thái sang Đang hoạt động và bắt đầu can thiệp giải quyết.
              </p>
              <button
                onClick={handleClaim}
                disabled={isSubmitting}
                className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play size={14} />
                <span>{isSubmitting ? "Đang xử lý..." : "Tiếp nhận giải quyết"}</span>
              </button>
            </Card>
          )}

          {incident.status === "IN_PROGRESS" && (
            <Card className="border border-border-light/35 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold text-neutral-dark">Phương án giải quyết</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleResolve} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-medium mb-1.5 uppercase tracking-wide">
                      Ghi chú / Kết luận giải quyết
                    </label>
                    <textarea
                      rows={4}
                      value={resolutionText}
                      onChange={(e) => setResolutionText(e.target.value)}
                      placeholder="Nhập nội dung phán quyết, phương án điều chỉnh điểm hoặc hình thức hỗ trợ..."
                      className="w-full p-3 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary resize-none bg-white font-semibold"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-emerald-700 transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} />
                    <span>{isSubmitting ? "Đang xử lý..." : "Đóng & Hoàn tất sự cố"}</span>
                  </button>
                </form>
              </CardContent>
            </Card>
          )}

          {incident.status === "RESOLVED" && (
            <Card className="border border-emerald-200 bg-emerald-50 text-emerald-950 p-5 shadow-sm">
              <div className="flex gap-2">
                <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="font-bold text-sm text-emerald-800">Sự cố đã được giải quyết</h4>
                  {incident.resolutionNote && (
                    <div className="text-xs text-emerald-700 mt-2 italic font-semibold">
                      " {incident.resolutionNote} "
                    </div>
                  )}
                  {incident.resolvedByName && (
                    <div className="text-[10px] text-neutral-medium mt-1 font-bold">
                      Bởi: {incident.resolvedByName}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetailPage;
