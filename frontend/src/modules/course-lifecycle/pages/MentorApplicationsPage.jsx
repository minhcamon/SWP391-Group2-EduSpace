import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileText,
  MessageSquare,
  AlertCircle,
  Calendar,
  Mail,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import creatorService from '@/services/creatorService'
import { runWithLoading } from '@/utils/utils'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/Dialog'

export default function MentorApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchingDetails, setIsFetchingDetails] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL') // ALL, PENDING, APPROVED, REJECTED

  // Selected Application for Detail Modal
  const [selectedApp, setSelectedApp] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Accordion state for submissions in modal
  const [expandedSubmissions, setExpandedSubmissions] = useState({})

  // Reject Modal State
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const fetchApplications = async () => {
    await runWithLoading(setIsLoading, async () => {
      try {
        const data = await creatorService.getMentorApplications()
        setApplications(data || [])
      } catch (error) {
        toast.error(error.message || 'Không thể tải danh sách đơn ứng tuyển.')
      }
    })
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleViewDetails = async (appId) => {
    setIsFetchingDetails(true)
    try {
      const data = await creatorService.getMentorApplicationDetails(appId)
      setSelectedApp(data)
      setIsDetailOpen(true)
      // Expand the first submission by default if exists
      if (data?.submissions?.length > 0) {
        setExpandedSubmissions({ 0: true })
      } else {
        setExpandedSubmissions({})
      }
    } catch (error) {
      toast.error(error.message || 'Không thể tải chi tiết đơn ứng tuyển.')
    } finally {
      setIsFetchingDetails(false)
    }
  }

  const handleApprove = async (appId) => {
    setIsSubmitting(true)
    try {
      await creatorService.approveMentorApplication(appId)
      toast.success('Đã phê duyệt đơn ứng tuyển Mentor thành công!')
      setIsDetailOpen(false)
      fetchApplications()
    } catch (error) {
      toast.error(error.message || 'Phê duyệt thất bại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRejectSubmit = async (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      toast.error('Vui lòng nhập lý do từ chối!')
      return
    }

    setIsSubmitting(true)
    try {
      await creatorService.rejectMentorApplication(selectedApp.id, rejectReason)
      toast.success('Đã từ chối đơn ứng tuyển!')
      setIsRejectOpen(false)
      setIsDetailOpen(false)
      setRejectReason('')
      fetchApplications()
    } catch (error) {
      toast.error(error.message || 'Từ chối thất bại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSubmissionExpand = (index) => {
    setExpandedSubmissions((prev) => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Filter logic
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Count stats
  const totalCount = applications.length
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length
  const approvedCount = applications.filter(
    (a) => a.status === 'APPROVED'
  ).length
  const rejectedCount = applications.filter(
    (a) => a.status === 'REJECTED'
  ).length

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock
              size={12}
              className="animate-pulse"
            />{' '}
            Chờ duyệt
          </span>
        )
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} /> Đã duyệt
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle size={12} /> Từ chối
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="p-6 bg-white border border-gray-200 shadow-xs rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl font-black text-secondary">
              Quản lý Đơn xin làm Mentor
            </h1>
            <p className="text-xs text-neutral-medium font-semibold mt-1">
              Phê duyệt hoặc từ chối các yêu cầu trở thành Mentor từ học viên đã
              hoàn thành khóa học của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-indigo-50 text-primary rounded-xl flex items-center justify-center">
            <Users size={22} />
          </div>
          <div>
            <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
              Tổng số đơn
            </span>
            <span className="text-xl font-black text-neutral-dark">
              {totalCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock
              size={22}
              className={pendingCount > 0 ? 'animate-pulse' : ''}
            />
          </div>
          <div>
            <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
              Đang chờ duyệt
            </span>
            <span className="text-xl font-black text-neutral-dark">
              {pendingCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
              Đã phê duyệt
            </span>
            <span className="text-xl font-black text-neutral-dark">
              {approvedCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <XCircle size={22} />
          </div>
          <div>
            <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
              Đã từ chối
            </span>
            <span className="text-xl font-black text-neutral-dark">
              {rejectedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Table container */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Tabs and search bar */}
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: `Tất cả (${totalCount})` },
              { id: 'PENDING', label: `Chờ duyệt (${pendingCount})` },
              { id: 'APPROVED', label: `Đã duyệt (${approvedCount})` },
              { id: 'REJECTED', label: `Từ chối (${rejectedCount})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-slate-50 text-neutral-medium hover:bg-slate-100 hover:text-neutral-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 text-neutral-light w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm ứng viên, email, khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs placeholder:text-neutral-light focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-semibold"
            />
          </div>
        </div>

        {/* Applications table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-neutral-medium font-bold">
                Đang tải danh sách đơn ứng tuyển...
              </span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-20 text-center text-neutral-medium">
              <AlertCircle className="mx-auto w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-bold">
                Không tìm thấy đơn ứng tuyển nào
              </p>
              <p className="text-xs font-semibold mt-1">
                Hệ thống chưa có đơn đăng ký nào khớp với bộ lọc.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-gray-100 font-bold text-neutral-medium uppercase tracking-wider">
                  <th className="py-4 px-6">Họ và tên</th>
                  <th className="py-4 px-4">Email</th>
                  <th className="py-4 px-4">Khóa học đăng ký</th>
                  <th className="py-4 px-4">Ngày nộp đơn</th>
                  <th className="py-4 px-4">Trạng thái</th>
                  <th className="py-4 px-6 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-neutral-dark">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/45 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-sm text-primary">
                      {app.userName}
                    </td>
                    <td className="py-4 px-4 text-neutral-medium">
                      {app.userEmail}
                    </td>
                    <td className="py-4 px-4 font-bold text-neutral-dark">
                      {app.courseTitle}
                    </td>
                    <td className="py-4 px-4 text-neutral-medium">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleViewDetails(app.id)}
                        disabled={isFetchingDetails}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-primary rounded-xl font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                      >
                        <Eye size={14} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen && !!selectedApp} onOpenChange={(open) => !open && setIsDetailOpen(false)}>
        {selectedApp && (
          <DialogContent className="w-full max-w-4xl bg-white dark:bg-card rounded-2xl overflow-hidden shadow-2xl p-0 gap-0 border border-slate-100 text-left flex flex-col max-h-[90vh]" showCloseButton={false}>
            {/* Modal Header */}
            <header className="bg-neutral-dark p-6 text-white flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-black flex items-center gap-2">
                  Đơn ứng tuyển làm Mentor:{' '}
                  <span className="text-secondary">{selectedApp.userName}</span>
                </DialogTitle>
                <DialogDescription className="text-[10px] text-slate-300 font-semibold mt-1">
                  Khóa học: {selectedApp.courseTitle}
                </DialogDescription>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-white"
              >
                <X size={20} />
              </button>
            </header>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Applicant Info Banner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-primary rounded-lg">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-medium font-bold block uppercase">
                      Họ và tên
                    </span>
                    <span className="font-bold text-neutral-dark">
                      {selectedApp.userName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-medium font-bold block uppercase">
                      Địa chỉ Email
                    </span>
                    <span className="font-bold text-neutral-dark">
                      {selectedApp.userEmail}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-medium font-bold block uppercase">
                      Ngày nộp đơn
                    </span>
                    <span className="font-bold text-neutral-dark">
                      {formatDate(selectedApp.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedApp.status === 'REJECTED' &&
                selectedApp.rejectedReason && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-rose-800 text-xs font-semibold">
                    <AlertCircle
                      size={18}
                      className="shrink-0 text-rose-600"
                    />
                    <div>
                      <p className="font-bold">Lý do từ chối:</p>
                      <p className="mt-1 text-rose-700">
                        {selectedApp.rejectedReason}
                      </p>
                    </div>
                  </div>
                )}

              {/* Assignments / Submissions Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-secondary flex items-center gap-1.5">
                  <FileText size={16} /> Kết quả làm bài tập trong khóa học
                </h3>

                {selectedApp.submissions?.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl text-neutral-medium text-xs font-semibold">
                    Ứng viên này chưa nộp bài tập nào trong lớp học.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedApp.submissions.map((sub, idx) => {
                      const isExpanded = expandedSubmissions[idx]
                      const totalRubricScore = sub.criteriaScores && sub.criteriaScores.length > 0
                        ? sub.criteriaScores.reduce((sum, item) => sum + (item.score || 0), 0)
                        : sub.finalScore
                      const totalRubricMax = sub.criteriaScores && sub.criteriaScores.length > 0
                        ? sub.criteriaScores.reduce((sum, item) => sum + (item.maxPoint || 0), 0)
                        : 100
                      const scorePercentage = totalRubricMax > 0 ? (totalRubricScore / totalRubricMax) * 100 : 0

                      return (
                        <div
                          key={idx}
                          className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs"
                        >
                          {/* Accordion Trigger Header */}
                          <button
                            onClick={() => toggleSubmissionExpand(idx)}
                            className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-left cursor-pointer transition-colors"
                          >
                            <div className="grow pr-4">
                              <h4 className="text-xs font-black text-neutral-dark">
                                {sub.assignmentTitle}
                              </h4>
                              <p className="text-[10px] text-neutral-medium line-clamp-1 mt-0.5">
                                {sub.assignmentDescription}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              {sub.finalScore !== null ? (
                                <span
                                  className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                                    scorePercentage >= 80
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : scorePercentage >= 50
                                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                                  }`}
                                >
                                  Điểm: {totalRubricScore}/{totalRubricMax}
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">
                                  Chưa chấm
                                </span>
                              )}
                              {isExpanded ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </div>
                          </button>

                          {/* Accordion Content */}
                          {isExpanded && (
                            <div className="p-5 border-t border-slate-100 bg-white space-y-4 text-xs font-medium">
                              {/* Assignment Desc */}
                              <div>
                                <h5 className="font-bold text-neutral-medium text-[10px] uppercase tracking-wider mb-1">
                                  Mô tả đề bài
                                </h5>
                                <p className="text-neutral-dark bg-slate-50/50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap font-semibold leading-relaxed">
                                  {sub.assignmentDescription}
                                </p>
                              </div>

                              {/* Submission Content */}
                              <div>
                                <h5 className="font-bold text-neutral-medium text-[10px] uppercase tracking-wider mb-1">
                                  Nội dung bài làm
                                </h5>
                                <div className="text-neutral-dark bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-x-auto font-mono text-[11px] whitespace-pre-wrap">
                                  {sub.submissionContent}
                                </div>
                              </div>

                              {/* Review section */}
                              {sub.finalScore !== null && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                  {/* Comments */}
                                  <div className="bg-indigo-50/30 p-4 rounded-xl border border-indigo-100/50 space-y-2">
                                    <h5 className="font-bold text-primary text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                      <MessageSquare size={13} /> Góp ý & nhận
                                      xét của reviewer
                                    </h5>
                                    <p className="text-neutral-dark font-semibold leading-relaxed italic whitespace-pre-wrap">
                                      "
                                      {sub.comments ||
                                        'Không có nhận xét chi tiết.'}
                                      "
                                    </p>
                                  </div>

                                  {/* Rubrics breakdown */}
                                  <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-2">
                                    <h5 className="font-bold text-neutral-medium text-[10px] uppercase tracking-wider">
                                      Chi tiết tiêu chí đánh giá (Rubrics)
                                    </h5>
                                    {sub.criteriaScores &&
                                    sub.criteriaScores.length > 0 ? (
                                      <div className="space-y-1.5">
                                        {sub.criteriaScores.map(
                                          (criterion, cIdx) => (
                                            <div
                                              key={cIdx}
                                              className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100"
                                            >
                                              <div>
                                                <p className="font-bold text-neutral-dark text-[11px]">
                                                  {criterion.criterionName}
                                                </p>
                                                <p className="text-[9px] text-neutral-medium">
                                                  {criterion.description}
                                                </p>
                                              </div>
                                              <span className="font-black text-primary text-[11px] bg-indigo-50 px-2 py-0.5 rounded-md">
                                                {criterion.score}/
                                                {criterion.maxPoint}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-neutral-light italic text-[11px]">
                                        Không có thông tin rubrics chi tiết.
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <footer className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-neutral-medium text-xs font-bold mr-2">
                  Trạng thái hiện tại:
                </span>
                {getStatusBadge(selectedApp.status)}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 hover:bg-slate-100 text-neutral-medium rounded-xl font-bold cursor-pointer transition-colors active:scale-95"
                >
                  Đóng
                </button>

                {selectedApp.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => setIsRejectOpen(true)}
                      disabled={isSubmitting}
                      className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
                    >
                      Từ chối đơn
                    </button>
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-primary hover:bg-[#0785b1] text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Đang duyệt...
                        </>
                      ) : (
                        'Đồng ý nhận làm Mentor'
                      )}
                    </button>
                  </>
                )}
              </div>
            </footer>
          </DialogContent>
        )}
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={(open) => !open && (setIsRejectOpen(false), setRejectReason(''))}>
        <DialogContent className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl p-0 gap-0 border border-slate-100 text-left" showCloseButton={false}>
            <header className="p-5 border-b border-gray-100 flex items-center justify-between">
              <DialogTitle className="text-sm font-black text-rose-700 flex items-center gap-1.5">
                <AlertCircle size={18} /> Nhập lý do từ chối đơn ứng tuyển
              </DialogTitle>
              <DialogDescription className="sr-only">
                Vui lòng cung cấp phản hồi từ chối đơn ứng tuyển Mentor
              </DialogDescription>
              <button
                type="button"
                onClick={() => {
                  setIsRejectOpen(false)
                  setRejectReason('')
                }}
                className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-500"
              >
                <X size={16} />
              </button>
            </header>

            <form onSubmit={handleRejectSubmit}>
              <div className="p-5 space-y-4">
                <p className="text-xs text-neutral-medium leading-relaxed font-semibold">
                  Vui lòng cung cấp lý do chi tiết từ chối để gửi lại cho học
                  viên{' '}
                  <span className="font-bold text-neutral-dark">
                    {selectedApp?.userName}
                  </span>
                  . Điều này giúp họ hiểu những gì cần cải thiện.
                </p>

                <textarea
                  required
                  rows={4}
                  placeholder="Ví dụ: Điểm số rubrics phần Code Quality của bạn chưa đạt yêu cầu của Mentor khóa học Java..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs placeholder:text-neutral-light focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-semibold leading-relaxed"
                />
              </div>

              <footer className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRejectOpen(false)
                    setRejectReason('')
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-200 hover:bg-slate-100 text-neutral-medium rounded-xl text-xs font-bold cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Đang từ chối...
                    </>
                  ) : (
                    'Xác nhận từ chối'
                  )}
                </button>
              </footer>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
