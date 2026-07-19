import {
  Users as LuUsers,
  Mail as LuMail,
  Calendar as LuCalendar
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/Dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from '@/components/ui/Table'
import Avatar from '@/components/common/Avatar'
import Button from '@/components/ui/Button'

export default function WaitlistDetailModal({ isOpen, onClose, waitlist }) {
  if (!waitlist) return null

  const { course = {}, students = [], status } = waitlist
  const studentCount = students.length

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    try {
      const date = new Date(dateStr)
      return date.toLocaleString("vi-VN")
    } catch {
      return dateStr
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-2xl bg-white text-neutral-dark p-6 rounded-2xl border border-border-light shadow-lg">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold text-secondary flex items-center gap-2">
            <LuUsers className="text-primary text-2xl" /> Chi tiết hàng chờ
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-medium">
            Khóa học: <span className="font-bold text-neutral-dark">{course.title}</span>
          </DialogDescription>
        </DialogHeader>

        {/* Waitlist Status Summary */}
        <div className="bg-bg-card border border-border-light/40 rounded-xl p-4 my-2 flex items-center justify-between text-xs font-semibold text-neutral-medium">
          <div>
            Số học viên hiện tại: <span className="text-primary font-bold text-sm">{studentCount}</span>
          </div>
          <div>
            Số lượng mở lớp chuẩn: <span className="text-neutral-dark font-bold text-sm">10</span>
          </div>
          <div className="flex items-center gap-1.5">
            Trạng thái:{" "}
            {status === "FULLED" || status === "CLOSED" ? (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-success/10 text-success border border-success/20">
                Đã mở lớp
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-warning/10 text-warning border border-warning/20">
                Đang gom học viên
              </span>
            )}
          </div>
        </div>

        {/* Students List Table */}
        <div className="max-h-72 overflow-y-auto border border-border-light/20 rounded-xl">
          <Table className="w-full text-left border-collapse">
            <TableHeader className="bg-slate-50/70 sticky top-0 z-10">
              <TableRow className="border-b border-border-light/20 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <TableHead className="py-3 pl-4">STT</TableHead>
                <TableHead className="py-3">Học viên</TableHead>
                <TableHead className="py-3">Email</TableHead>
                <TableHead className="py-3 pr-4">Thời gian tham gia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 text-xs font-semibold">
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center text-neutral-light font-medium">
                    Chưa có học viên nào tham gia hàng chờ này
                  </TableCell>
                </TableRow>
              ) : (
                students.map((entry, index) => (
                  <TableRow key={entry.id} className="hover:bg-slate-50/20 transition-colors">
                    {/* Index */}
                    <TableCell className="py-3 pl-4 text-neutral-medium w-12">{index + 1}</TableCell>

                    {/* Student Info */}
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={entry.user?.avatarUrl} alt={entry.user?.fullName} className="w-7 h-7" />
                        <span className="font-extrabold text-neutral-dark">{entry.user?.fullName}</span>
                      </div>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="py-3 text-neutral-medium">
                      <div className="flex items-center gap-1.5">
                        <LuMail size={13} className="text-gray-400" />
                        <span>{entry.user?.email || "Chưa cập nhật"}</span>
                      </div>
                    </TableCell>

                    {/* Enrolled At Date */}
                    <TableCell className="py-3 pr-4 text-neutral-medium">
                      <div className="flex items-center gap-1.5">
                        <LuCalendar size={13} className="text-gray-400" />
                        <span>{formatDate(entry.enrolledAt)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end gap-2 pt-4 mt-2 border-t border-border-light/20">
          <Button variant="outline" className="rounded-xl px-5 border-border-light text-neutral-medium hover:bg-slate-50 cursor-pointer text-xs" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
