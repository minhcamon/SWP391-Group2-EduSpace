import React from "react";
import { Link } from "react-router";
import { AlertTriangle, Search, CheckCircle, Play, Eye, Users } from "lucide-react";
import useIncidents from "../hooks/useIncidents";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";

const IncidentsPage = () => {
    const {
        incidents,
        isLoading,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        filtered,
        handleClaim
    } = useIncidents();

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
            case "PEER_REVIEW_DISPUTE":     return "Tranh chấp chấm chéo";
            case "INACTIVE_PARTNER":        return "Bạn học không hoạt động";
            case "MEMBER_CONFLICT":         return "Xung đột thành viên";
            case "RESCUE_SUPPORT_REQUEST":  return "Yêu cầu cứu trợ";
            default: return type;
        }
    };

    return (
        <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                        Trung tâm Sự cố — Incident Center
                    </h1>
                    <p className="text-sm text-neutral-medium mt-1">
                        Ghi nhận, phân công và xử lý các sự cố khẩn cấp từ các cặp đôi học tập.
                    </p>
                </div>
            </div>

            {/* KPIs Grid — đồng bộ MentorDashboardPage */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-primary mb-1">
                        {incidents.length}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Tổng sự cố
                    </span>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-amber-600 mb-1">
                        {incidents.filter(i => i.status === "PENDING").length}
                    </span>
                    <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wide">
                        Chờ tiếp nhận
                    </span>
                </div>
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-blue-600 mb-1">
                        {incidents.filter(i => i.status === "IN_PROGRESS").length}
                    </span>
                    <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wide">
                        Đang xử lý
                    </span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-emerald-600 mb-1">
                        {incidents.filter(i => i.status === "RESOLVED").length}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Đã giải quyết
                    </span>
                </div>
            </div>

            {/* Tabs and Filters — đồng bộ MentorDashboardPage */}
            <div className="bg-white border border-border-light/35 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex border-b border-slate-100 w-full md:w-auto">
                    {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                                activeTab === tab
                                    ? "border-primary text-primary"
                                    : "border-transparent text-neutral-medium hover:text-primary"
                            }`}
                        >
                            {tab === "ALL"         ? "Tất cả sự cố"
                             : tab === "PENDING"   ? "Chờ xử lý"
                             : tab === "IN_PROGRESS" ? "Đang xử lý"
                             : "Đã giải quyết"}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-2.5 text-neutral-light w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo ID, loại sự cố, người báo cáo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary transition-all duration-200"
                    />
                </div>
            </div>

            {/* Incidents Table */}
            {isLoading ? (
                <div className="grow flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white border border-border-light/35 rounded-md p-12 text-center shadow-sm">
                    <AlertTriangle size={48} className="mx-auto text-neutral-light mb-4" />
                    <h3 className="text-lg font-bold text-neutral-dark mb-1">Không tìm thấy sự cố nào</h3>
                    <p className="text-sm text-neutral-medium">Không có sự cố nào khớp với bộ lọc hiện tại.</p>
                </div>
            ) : (
                <div className="bg-white border border-border-light/35 rounded-md shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mã sự cố</TableHead>
                                <TableHead>Loại sự cố</TableHead>
                                <TableHead>Người báo cáo</TableHead>
                                <TableHead>Lý do</TableHead>
                                <TableHead>Thời gian</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((inc) => (
                                <TableRow key={inc.id}>
                                    <TableCell className="font-bold text-primary">{inc.id}</TableCell>
                                    <TableCell className="font-semibold text-neutral-dark">
                                        {getTypeLabel(inc.incidentType)}
                                    </TableCell>
                                    <TableCell className="font-semibold">{inc.reporterName}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={inc.reason}>{inc.reason}</TableCell>
                                    <TableCell className="text-neutral-medium text-xs font-semibold">
                                        {inc.createdAt ? new Date(inc.createdAt).toLocaleString("vi-VN") : "N/A"}
                                    </TableCell>
                                    <TableCell>{getStatusBadge(inc.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {inc.status === "PENDING" && (
                                                <button
                                                    onClick={(e) => handleClaim(inc.id, e)}
                                                    className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/95 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Play size={12} />
                                                    Nhận xử lý
                                                </button>
                                            )}
                                            <Link
                                                to={`/mentor/incidents/${inc.id}`}
                                                className="px-3 py-1.5 border border-primary/20 text-primary hover:bg-primary/5 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                                            >
                                                <Eye size={12} />
                                                Chi tiết
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

export default IncidentsPage;
