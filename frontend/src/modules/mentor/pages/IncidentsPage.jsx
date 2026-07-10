import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { AlertTriangle, Search, CheckCircle, ShieldAlert, Play, Eye } from "lucide-react";
import mentorService from "@/services/mentorService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/Table";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

const IncidentsPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchIncidents = async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const data = await mentorService.getIncidents();
        setIncidents(data);
      });
    } catch (err) {
      toast.error("Không thể tải danh sách sự cố!");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleClaim = async (id, e) => {
    e.preventDefault();
    try {
      const res = await mentorService.claimIncident(id);
      toast.success(res.message || "Nhận xử lý sự cố thành công!");
      fetchIncidents();
    } catch (err) {
      toast.error(err.message || "Lỗi khi nhận xử lý sự cố!");
    }
  };

  const filtered = incidents
    .filter((inc) => activeTab === "ALL" || inc.status === activeTab)
    .filter(
      (inc) =>
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.pairName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge variant="destructive" className="bg-red-600 text-white font-bold uppercase tracking-wider text-[10px]">Critical</Badge>;
      case "HIGH":
        return <Badge variant="secondary" className="bg-amber-500 text-white font-bold uppercase tracking-wider text-[10px]">High</Badge>;
      default:
        return <Badge variant="outline" className="bg-slate-100 text-neutral-medium border-slate-200 font-bold uppercase tracking-wider text-[10px]">Medium</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="pending" className="font-bold text-[10px] uppercase">Chờ xử lý</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="roletag" className="bg-blue-50 text-blue-700 font-bold text-[10px] uppercase border border-blue-200">Đang xử lý</Badge>;
      case "RESOLVED":
        return <Badge variant="approved" className="font-bold text-[10px] uppercase">Đã giải quyết</Badge>;
      default:
        return null;
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

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
            Trung tâm Sự cố  -  Incident Center
          </h1>
          <p className="text-sm text-neutral-medium mt-1">
            Ghi nhận, phân công và xử lý các sự cố khẩn cấp từ các cặp đôi học tập.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-xl text-red-600">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">
                {incidents.filter(i => i.status === "PENDING" && i.priority === "CRITICAL").length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Sự cố Nguy cấp Chờ xử lý</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">
                {incidents.filter(i => i.status === "PENDING").length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Sự cố Đang Chờ tiếp nhận</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border-light/40 shadow-sm">
          <CardContent className="pt-1 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Play size={20} />
            </div>
            <div>
              <p className="text-xl font-bold text-neutral-dark">
                {incidents.filter(i => i.status === "IN_PROGRESS").length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Sự cố Đang được Giải quyết</p>
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
                {incidents.filter(i => i.status === "RESOLVED").length}
              </p>
              <p className="text-xs text-neutral-medium font-semibold">Sự cố Đã Giải quyết xong</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
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
              {tab === "ALL"
                ? "Tất cả sự cố"
                : tab === "PENDING"
                ? "Chờ xử lý"
                : tab === "IN_PROGRESS"
                ? "Đang xử lý"
                : "Đã giải quyết"}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-neutral-light w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm theo ID, loại sự cố, lớp, học viên..."
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
        <div className="bg-white border border-border-light/35 rounded-2xl p-12 text-center shadow-sm">
          <AlertTriangle size={48} className="mx-auto text-neutral-light mb-4" />
          <h3 className="text-lg font-bold text-neutral-dark mb-1">Không tìm thấy sự cố nào</h3>
          <p className="text-sm text-neutral-medium">Không có sự cố nào khớp với bộ lọc hiện tại.</p>
        </div>
      ) : (
        <div className="bg-white border border-border-light/35 rounded-2xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã sự cố</TableHead>
                <TableHead>Loại sự cố</TableHead>
                <TableHead>Lớp học</TableHead>
                <TableHead>Cặp học viên</TableHead>
                <TableHead>Độ khẩn</TableHead>
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
                    {getTypeLabel(inc.type)}
                  </TableCell>
                  <TableCell>{inc.className}</TableCell>
                  <TableCell className="font-semibold">{inc.pairName}</TableCell>
                  <TableCell>{getPriorityBadge(inc.priority)}</TableCell>
                  <TableCell className="text-neutral-medium text-xs font-semibold">{inc.createdTime}</TableCell>
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
