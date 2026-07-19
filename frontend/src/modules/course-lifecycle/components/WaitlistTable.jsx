import { useState } from 'react'
import {
  Users,
  Eye,
  Play,
  CheckCircle,
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/Table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/Dialog'
import Badge from '@/components/ui/Badge'
import WaitlistDetailModal from './WaitlistDetailModal'
import { toast } from 'sonner'

export default function WaitlistTable({ waitlists = [], onStartClass, isLoading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  
  // Modal states
  const [selectedWaitlist, setSelectedWaitlist] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [confirmWaitlist, setConfirmWaitlist] = useState(null)
  const [isStartingClass, setIsStartingClass] = useState(false)

  // Open details modal
  const handleOpenDetail = (wl) => {
    setSelectedWaitlist(wl)
    setIsDetailOpen(true)
  }

  // Open confirm start class modal
  const handleOpenConfirm = (wl) => {
    setConfirmWaitlist(wl)
  }

  // Confirm start class action
  const handleConfirmStartClass = async () => {
    if (!confirmWaitlist) return
    
    setIsStartingClass(true)
    try {
      await onStartClass(confirmWaitlist.id)
      setConfirmWaitlist(null)
    } catch (error) {
      toast.error(error.message || "Không thể bắt đầu lớp học")
    } finally {
      setIsStartingClass(false)
    }
  }

  // Render Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "OPENING":
        return (
          <Badge className="bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
            Đang gom học viên
          </Badge>
        )
      case "FULLED":
        return (
          <Badge className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
            Đã mở lớp
          </Badge>
        )
      case "CLOSED":
        return (
          <Badge className="bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-md font-bold text-[10px]">
            Đã đóng
          </Badge>
        )
      default:
        return null
    }
  }

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("vi-VN")
    } catch {
      return dateStr
    }
  }

  // Format batch label helper
  const formatBatchLabel = (dateStr) => {
    if (!dateStr) return "Đợt tuyển sinh"
    try {
      const date = new Date(dateStr)
      return `Đợt: Tháng ${date.getMonth() + 1}/${date.getFullYear()}`
    } catch {
      return "Đợt tuyển sinh"
    }
  }

  // Filter waitlists
  const filteredWaitlists = waitlists.filter((wl) => {
    const matchesSearch = 
      wl.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      wl.id?.toString().includes(searchQuery)
      
    const matchesStatus = 
      statusFilter === "ALL" || 
      wl.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* Filters Card */}
      <div className="bg-white border border-border-light/40 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 z-10 pointer-events-none">
            <Users className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="Tìm tên khóa học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9.5 pr-4 py-2.5 bg-bg-card border border-border-light/30 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400 transition-all"
          />
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-medium shrink-0">Trạng thái:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white border border-border-light/40 pl-4 pr-10 py-2.5 h-auto rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer transition-all shadow-xs w-48">
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả hàng chờ</SelectItem>
              <SelectItem value="OPENING">Đang gom học viên</SelectItem>
              <SelectItem value="FULLED">Đã mở lớp</SelectItem>
              <SelectItem value="CLOSED">Đã đóng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-border-light/30 rounded-2xl shadow-xs overflow-hidden">
        {filteredWaitlists.length === 0 ? (
          <div className="py-20 text-center text-neutral-light font-medium flex flex-col items-center justify-center gap-3">
            <Users className="text-5xl text-neutral-light/40" />
            <span className="text-sm">Không tìm thấy hàng chờ nào phù hợp</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="w-full text-left border-collapse">
              <TableHeader>
                <TableRow className="border-b border-border-light/30 bg-slate-50/50 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <TableHead className="py-4 pl-6 pr-4">Khóa học</TableHead>
                  <TableHead className="py-4 px-4">Tiến độ tuyển sinh</TableHead>
                  <TableHead className="py-4 px-4">Trạng thái</TableHead>
                  <TableHead className="py-4 px-2 w-[110px]"></TableHead>
                  <TableHead className="py-4 pl-2 pr-6 text-left w-[150px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredWaitlists.map((wl) => {
                  const studentCount = wl.students?.length || 0
                  // Dung lượng waitlist tiêu chuẩn từ backend là 10
                  const percent = Math.min(100, Math.round((studentCount / 10) * 100))
                  const isOpened = wl.status === "FULLED" || wl.status === "CLOSED"

                  return (
                    <TableRow 
                      key={wl.id} 
                      className={`hover:bg-slate-50/40 transition-colors ${
                        isOpened ? "opacity-70" : ""
                      }`}
                    >
                      {/* Name & Code */}
                      <TableCell className="py-4 pl-6 pr-4">
                        <div className="space-y-1.5">
                          <span 
                            className={`font-extrabold transition-colors cursor-pointer inline-flex items-center gap-2 ${
                              isOpened 
                                ? "text-neutral-medium hover:text-primary" 
                                : "text-neutral-dark hover:text-primary"
                            }`} 
                            onClick={() => handleOpenDetail(wl)}
                          >
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                              isOpened 
                                ? "bg-slate-100 text-slate-400" 
                                : "bg-primary/10 text-primary"
                            }`}>
                              #{wl.id}
                            </span>
                            {wl.course?.title}
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-neutral-medium">
                            <span className="bg-slate-100 border border-slate-200/30 text-neutral-medium px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider">
                              {formatBatchLabel(wl.createdAt)}
                            </span>
                            <span className="text-neutral-light font-medium flex items-center gap-1">
                              <Calendar size={12} className="text-gray-400" />
                              Tạo ngày: {formatDate(wl.createdAt)}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Progress Enrolled */}
                      <TableCell className="py-4 px-4">
                        <div className="space-y-1.5 max-w-[160px]">
                          <div className="flex justify-between text-[10px] font-bold text-neutral-medium">
                            <span>{studentCount} / 10 HV</span>
                            <span>{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOpened
                                  ? "bg-slate-400"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>

                      {/* Status Badge */}
                      <TableCell className="py-4 px-4">
                        {renderStatusBadge(wl.status)}
                      </TableCell>

                      {/* Details Button Column */}
                      <TableCell className="py-4 px-2 text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-medium hover:text-primary hover:bg-slate-50 border border-transparent hover:border-slate-100 font-bold rounded-xl"
                          onClick={() => handleOpenDetail(wl)}
                        >
                          <Eye /> Chi tiết
                        </Button>
                      </TableCell>

                      {/* Main Action Column */}
                      <TableCell className="py-4 pl-2 pr-6 text-left">
                        <div className="flex justify-start">
                          {isOpened ? (
                            <Button
                              disabled
                              variant="outline"
                              size="sm"
                              className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold rounded-xl inline-flex justify-center w-[125px]"
                            >
                              <CheckCircle /> Đã mở lớp
                            </Button>
                          ) : (
                            <Button
                              variant="default"
                              size="sm"
                              className="font-bold transition-all rounded-xl inline-flex justify-center w-[125px] bg-primary hover:bg-primary/90 text-white cursor-pointer shadow-sm hover:shadow-[0px_4px_12px_rgba(8,151,200,0.2)]"
                              onClick={() => handleOpenConfirm(wl)}
                            >
                              <Play className="fill-current" /> Bắt đầu lớp
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Waitlist detail modal */}
      <WaitlistDetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false)
          setSelectedWaitlist(null)
        }}
        waitlist={selectedWaitlist}
      />

      {/* Confirmation Start Class Modal */}
      <Dialog open={confirmWaitlist !== null} onOpenChange={(open) => { if (!open) setConfirmWaitlist(null) }}>
        <DialogContent className="sm:max-w-md bg-white text-neutral-dark p-6 rounded-2xl border border-border-light shadow-lg">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-bold text-neutral-dark flex items-center gap-2">
              <Play className="text-primary text-xl" /> Xác nhận bắt đầu lớp học
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-medium">
              Khởi tạo lớp học chính thức từ danh sách hàng chờ đăng ký.
            </DialogDescription>
          </DialogHeader>

          {confirmWaitlist && (
            <div className="space-y-4 py-3">
              <p className="text-xs text-neutral-medium">
                Bạn có chắc chắn muốn mở lớp học mới cho khóa học <span className="font-extrabold text-neutral-dark">{confirmWaitlist.course?.title}</span>?
              </p>

              <div className="bg-bg-card border border-border-light/30 rounded-xl p-3 text-[11px] font-semibold text-neutral-medium space-y-1.5">
                <div className="flex justify-between">
                  <span>Số học viên nhập học:</span>
                  <span className="font-bold text-neutral-dark">{confirmWaitlist.students?.length || 0} học viên</span>
                </div>
              </div>

              {confirmWaitlist.students?.length < 10 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-700 font-semibold leading-relaxed">
                  <AlertTriangle className="text-amber-600 shrink-0 text-sm mt-0.5" />
                  <span>
                    Số lượng học viên hiện tại ({confirmWaitlist.students?.length || 0}) chưa đạt sĩ số tối thiểu (10 học viên) để tự động mở lớp. Bạn vẫn có thể bắt đầu lớp thủ công.
                  </span>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setConfirmWaitlist(null)}
              disabled={isStartingClass}
              className="rounded-xl px-4 text-xs font-semibold text-neutral-medium cursor-pointer"
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmStartClass}
              isLoading={isStartingClass}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-4 text-xs font-semibold cursor-pointer"
            >
              Xác nhận mở lớp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
