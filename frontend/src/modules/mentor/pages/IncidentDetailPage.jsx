import React from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import useIncidentDetail from "../hooks/useIncidentDetail";
import Badge from "@/components/ui/Badge";

// Import relocated components
import IncidentReportCard from "../components/mentor-incident/IncidentReportCard";
import IncidentDisputeCard from "../components/mentor-incident/IncidentDisputeCard";
import IncidentHistoryLog from "../components/mentor-incident/IncidentHistoryLog";
import IncidentActionCard from "../components/mentor-incident/IncidentActionCard";

const IncidentDetailPage = () => {
    const { id } = useParams();
    const {
        incident,
        isLoading,
        isSubmitting,
        handleClaim,
        handleResolve,
        handleReject,
        handleWarn
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
            case "ASSIGNMENT_DISPUTE":
                return "Tranh chấp bài tập";
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
            action: incident.status === "REJECTED"
                ? `Mentor ${incident.resolvedByName || ""} từ chối phân xử: ${incident.resolutionNote || ""}`
                : `Mentor ${incident.resolvedByName || ""} giải quyết sự cố: ${incident.resolutionNote || ""}`
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
                    {incident.incidentType === "ASSIGNMENT_DISPUTE" && <IncidentDisputeCard incident={incident} />}
                </div>

                {/* Right Column (3): Resolve / Claim Actions */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    <IncidentActionCard
                        incident={incident}
                        isSubmitting={isSubmitting}
                        handleClaim={handleClaim}
                        handleResolve={handleResolve}
                        handleReject={handleReject}
                        handleWarn={handleWarn}
                    />
                    <IncidentHistoryLog history={historyData} />
                </div>
            </div>
        </div>
    );
};

export default IncidentDetailPage;
