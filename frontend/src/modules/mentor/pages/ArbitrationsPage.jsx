import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Scale, Search, CheckCircle, Clock, Eye, Sparkles } from "lucide-react";
import mentorService from "@/services/mentorService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const ArbitrationsPage = () => {
  const [arbitrations, setArbitrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchArbitrations = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getArbitrations();
        setArbitrations(data);
      });
    } catch (err) {
      toast.error("Không thể tải danh sách khiếu nại chấm điểm!");
    }
  };

  useEffect(() => {
    fetchArbitrations();
  }, []);

  const filtered = arbitrations
    .filter((a) => activeTab === "ALL" || a.status === activeTab)
    .filter(
      (a) =>
        a?.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
        a?.submissionTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a?.reporterName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Phân xử Điểm  -  Arbitration Center
          </h1>
          <p className="text-sm text-neutral-medium mt-1">
            Giải quyết các khiếu nại / chênh lệch điểm số đánh giá chéo giữa các học viên.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">
                {arbitrations.filter((a) => a.status === "PENDING").length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Khiếu nại Chờ Phân xử</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <Scale size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">
                {arbitrations.length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Tổng số ca khiếu nại</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">
                {arbitrations.filter((a) => a.status === "RESOLVED").length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Khiếu nại Đã Giải quyết</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-border-light/35 rounded-2xl p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex border-b border-slate-100 w-full md:w-auto">
          {["PENDING", "RESOLVED", "ALL"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-neutral-medium hover:text-primary"
              }`}
            >
              {tab === "ALL"
                ? "Tất cả khiếu nại"
                : tab === "PENDING"
                ? "Chờ phân xử"
                : "Đã giải quyết"}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-neutral-light w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm mã đơn, tên bài tập, học viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="grow flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border-light/35 rounded-2xl p-12 text-center shadow-sm">
          <Scale size={48} className="mx-auto text-neutral-light mb-4" />
          <h3 className="text-lg font-bold text-neutral-dark mb-1">Không tìm thấy yêu cầu phân xử nào</h3>
          <p className="text-sm text-neutral-medium">Các khiếu nại điểm số sẽ được ghi nhận và hiển thị ở đây.</p>
        </div>
      ) : (
        <div className="bg-white border border-border-light/35 rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Bài tập</TableHead>
                <TableHead>Học viên khiếu nại</TableHead>
                <TableHead>Người chấm chéo</TableHead>
                <TableHead>Lý do khiếu nại</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((arb) => (
                <TableRow key={arb.id}>
                  <TableCell className="font-bold text-primary">#{arb.id}</TableCell>
                  <TableCell className="font-semibold text-neutral-dark">{arb.className}</TableCell>
                  <TableCell className="font-semibold text-neutral-dark">{arb.submissionTitle}</TableCell>
                  <TableCell className="font-semibold">{arb.reporterName}</TableCell>
                  <TableCell className="font-semibold">{arb.reportedName || "Hệ thống"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-neutral-medium font-semibold" title={arb.reason}>
                    {arb.reason}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-neutral-medium">
                    {arb.createdAt ? new Date(arb.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(arb.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      to={`/mentor/arbitrations/${arb.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-lg transition-all shadow-sm"
                    >
                      <Sparkles size={12} />
                      {arb.status === "PENDING" ? "Phân xử" : "Xem chi tiết"}
                    </Link>
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

export default ArbitrationsPage;
