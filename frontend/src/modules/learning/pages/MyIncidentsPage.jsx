import React, { useEffect } from "react";
import { AlertCircle, Search, Eye } from "lucide-react";
import useMyIncidents from "../hooks/useMyIncidents";
import IncidentDetailModal from "../components/IncidentDetailModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import EmptyState from "@/components/ui/EmptyState";

const MyIncidentsPage = () => {
  const {
    isLoading,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedIncidentId,
    setSelectedIncidentId,
    detailData,
    detailLoading,
    filteredIncidents,
    fetchMyIncidents,
  } = useMyIncidents();

  useEffect(() => {
    fetchMyIncidents();
  }, [fetchMyIncidents]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="pending" className="font-bold text-[10px] uppercase">Đang chờ</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="roletag" className="bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-200">Đang xử lý</Badge>;
      case "RESOLVED":
        return <Badge variant="approved" className="font-bold text-[10px] uppercase">Đã giải quyết</Badge>;
      case "REJECTED":
        return <Badge variant="destructive" className="font-bold text-[10px] uppercase">Bị từ chối</Badge>;
      default:
        return <Badge variant="outline" className="font-bold text-[10px] uppercase bg-slate-100 text-slate-500">{status}</Badge>;
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

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full transition-colors duration-300">
      
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark dark:text-white tracking-tight">
          Khiếu nại của tôi
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Theo dõi trạng thái và kết quả xử lý các yêu cầu hỗ trợ hoặc tranh chấp điểm số của bạn.
        </p>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        {/* Status Tabs */}
        <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 shrink-0">
          {[
            { id: "ALL", label: "Tất cả" },
            { id: "PENDING", label: "Đang chờ" },
            { id: "IN_PROGRESS", label: "Đang xử lý" },
            { id: "RESOLVED", label: "Đã giải quyết" },
            { id: "REJECTED", label: "Bị từ chối" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm lý do hoặc loại sự cố..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Main Content Table/List */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Đang tải dữ liệu khiếu nại...</span>
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={AlertCircle}>
            Không tìm thấy yêu cầu khiếu nại nào tương thích.
          </EmptyState>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl shadow-xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28 text-xs font-bold font-heading">Mã sự cố</TableHead>
                <TableHead className="w-52 text-xs font-bold font-heading">Loại khiếu nại</TableHead>
                <TableHead className="text-xs font-bold font-heading">Lý do khiếu nại</TableHead>
                <TableHead className="w-36 text-xs font-bold text-center font-heading">Trạng thái</TableHead>
                <TableHead className="w-40 text-xs font-bold font-heading">Ngày gửi</TableHead>
                <TableHead className="w-28 text-xs font-bold text-center font-heading">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-mono text-xs font-bold text-slate-500">
                    #INC-{incident.id.toString().padStart(4, "0")}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-neutral-dark dark:text-white">
                    {getTypeLabel(incident.incidentType)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600 dark:text-slate-350 max-w-sm truncate font-medium">
                    {incident.reason}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(incident.status)}
                  </TableCell>
                  <TableCell className="text-xs text-slate-550 dark:text-slate-400 font-semibold">
                    {new Date(incident.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      onClick={() => setSelectedIncidentId(incident.id)}
                      variant="ghost"
                      size="icon-sm"
                      className="text-primary hover:bg-primary/5 hover:text-primary transition-all duration-200 cursor-pointer"
                    >
                      <Eye size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ================= INCIDENT DETAIL MODAL ================= */}
      <IncidentDetailModal
        selectedIncidentId={selectedIncidentId}
        onClose={() => setSelectedIncidentId(null)}
        isLoading={detailLoading}
        detailData={detailData}
        getTypeLabel={getTypeLabel}
        getStatusBadge={getStatusBadge}
      />

    </div>
  );
};

export default MyIncidentsPage;
