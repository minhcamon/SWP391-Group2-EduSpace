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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

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
      app?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app?.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Count stats
  const totalCount = applications.length
  const pendingCount = applications.filter((a) => a.status === 'PENDING').length
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length
  const rejectedCount = applications.filter((a) => a.status === 'REJECTED').length

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('vi-VN', {
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
            <Clock size={12} className="animate-pulse" /> Chờ duyệt
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
    <div className="w-full space-y-8 animate-in fade-in duration-300">

      {/* Header section — đồng bộ với CourseManagementPage */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <CardHeader className="p-0 flex-1">
            <CardTitle className="text-2xl font-bold text-secondary">
              Quản lý Đơn xin làm Mentor
            </CardTitle>
            <CardDescription className="text-sm text-neutral-medium mt-1">
              Phê duyệt hoặc từ chối các yêu cầu trở thành Mentor từ học viên đã hoàn thành khóa học của bạn.
            </CardDescription>
          </CardHeader>
        </div>
      </Card>

      {/* KPI Stats — đồng bộ với CourseManagementPage */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(8,151,200,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Users className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Tổng số đơn
              </span>
              <span className="text-2xl font-black text-neutral-dark">{totalCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(242,128,32,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className={`text-xl ${pendingCount > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Đang chờ duyệt
              </span>
              <span className="text-2xl font-black text-neutral-dark">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(117,187,71,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
              <CheckCircle2 className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Đã phê duyệt
              </span>
              <span className="text-2xl font-black text-neutral-dark">{approvedCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(239,68,68,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <XCircle className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Đã từ chối
              </span>
              <span className="text-2xl font-black text-neutral-dark">{rejectedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar Row — đồng bộ với CourseManagementPage */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-2xl border border-border-light/30 shadow-sm w-full">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full lg:w-auto">
          <TabsList className="flex flex-row flex-wrap h-auto! gap-2 bg-transparent p-0 w-full justify-start py-1">
            {[
              { label: 'Tất cả', value: 'ALL', count: totalCount },
              { label: 'Chờ duyệt', value: 'PENDING', count: pendingCount },
              { label: 'Đã duyệt', value: 'APPROVED', count: approvedCount },
              { label: 'Từ chối', value: 'REJECTED', count: rejectedCount }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-transparent shrink-0 ${
                  statusFilter === tab.value
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-neutral-medium hover:bg-slate-50'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold transition-colors ${
                    statusFilter === tab.value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-dark/10 text-neutral-dark'
                  }`}
                >
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80 flex items-center shrink-0">
          <span className="absolute left-3.5 flex items-center text-neutral-light z-10 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Tìm ứng viên, email, khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-base border border-border-light/20 focus:border-secondary/50 focus:ring-1 focus:ring-secondary/20 rounded-xl text-xs outline-none transition-all placeholder:text-neutral-light font-semibold"
          />
        </div>
      </div>

      {/* Applications Table Container */}
      <Card className="bg-white border border-gray-200 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-neutral-medium font-bold">
                Đang tải danh sách đơn ứng tuyển...
              </span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12">
              <EmptyState
                icon={Users}
                title={
                  searchTerm
                    ? 'Không tìm thấy đơn ứng tuyển nào'
                    : statusFilter === 'ALL'
                      ? 'Chưa có đơn ứng tuyển nào'
                      : statusFilter === 'PENDING'
                        ? 'Không có đơn nào đang chờ duyệt'
                        : statusFilter === 'APPROVED'
                          ? 'Chưa có đơn nào được phê duyệt'
                          : 'Chưa có đơn nào bị từ chối'
                }
                description={
                  searchTerm
                    ? 'Không tìm thấy đơn khớp với từ khóa tìm kiếm của bạn.'
                    : 'Hệ thống chưa có đơn đăng ký nào khớp với bộ lọc đã chọn.'
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={app.id} className="hover:bg-slate-50/45 transition-colors">
                      <td className="py-4 px-6 font-bold text-sm text-secondary">{app.userName}</td>
                      <td className="py-4 px-4 text-neutral-medium">{app.userEmail}</td>
                      <td className="py-4 px-4 font-bold text-neutral-dark">{app.courseTitle}</td>
                      <td className="py-4 px-4 text-neutral-medium">{formatDate(app.createdAt)}</td>
                      <td className="py-4 px-4">{getStatusBadge(app.status)}</td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleViewDetails(app.id)}
                          disabled={isFetchingDetails}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-bold transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                        >
                          <Eye size={14} /> Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen && !!selectedApp} onOpenChange={(open) => !open && setIsDetailOpen(false)}>
        <DialogContent className="w-full max-w-4xl bg-white dark:bg-card rounded-2xl overflow-hidden shadow-2xl p-0 gap-0 border border-slate-100 text-left flex flex-col max-h-[90vh]" showCloseButton={false}>
          {selectedApp && (
            <>
              {/* Modal Header */}
              <header className="bg-neutral-dark p-5 sm:p-6 text-white flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-base sm:text-lg font-black flex flex-wrap items-center gap-1.5 sm:gap-2 break-words">
                    <span>Đơn ứng tuyển làm Mentor:</span>{' '}
                    <span className="text-secondary font-extrabold">{selectedApp.userName}</span>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-300 font-semibold mt-1 truncate">
                    Khóa học: {selectedApp.courseTitle}
                  </DialogDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-white shrink-0"
                >
                  <X size={20} />
                </button>
              </header>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Applicant Info Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-secondary/10 text-secondary rounded-xl shrink-0 mt-0.5">
                      <Users size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-neutral-medium font-bold block uppercase tracking-wider">Họ và tên</span>
                      <span className="font-bold text-neutral-dark break-words text-xs leading-snug block mt-0.5">{selectedApp.userName}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                      <Mail size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-neutral-medium font-bold block uppercase tracking-wider">Địa chỉ Email</span>
                      <span className="font-bold text-neutral-dark break-all text-xs leading-snug block mt-0.5">{selectedApp.userEmail}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 mt-0.5">
                      <Calendar size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-neutral-medium font-bold block uppercase tracking-wider">Ngày nộp đơn</span>
                      <span className="font-bold text-neutral-dark break-words text-xs leading-snug block mt-0.5">{formatDate(selectedApp.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {selectedApp.status === 'REJECTED' && selectedApp.rejectedReason && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 text-rose-800 text-xs font-semibold">
                    <AlertCircle size={18} className="shrink-0 text-rose-600" />
                    <div>
                      <p className="font-bold">Lý do từ chối:</p>
                      <p className="mt-1 text-rose-700">{selectedApp.rejectedReason}</p>
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
                        const totalRubricScore = sub.criteriaScores?.length > 0
                          ? sub.criteriaScores.reduce((sum, item) => sum + (item.score || 0), 0)
                          : sub.finalScore
                        const totalRubricMax = sub.criteriaScores?.length > 0
                          ? sub.criteriaScores.reduce((sum, item) => sum + (item.maxPoint || 0), 0)
                          : 100
                        const scorePercentage = totalRubricMax > 0 ? (totalRubricScore / totalRubricMax) * 100 : 0

                        return (
                          <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs">
                            <button
                              onClick={() => toggleSubmissionExpand(idx)}
                              className="w-full px-5 py-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between text-left cursor-pointer transition-colors"
                            >
                              <div className="grow pr-4">
                                <h4 className="text-xs font-black text-neutral-dark">{sub.assignmentTitle}</h4>
                                <p className="text-[10px] text-neutral-medium line-clamp-1 mt-0.5">{sub.assignmentDescription}</p>
                              </div>
                              <div className="flex items-center gap-4 shrink-0">
                                {sub.finalScore !== null ? (
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                                    scorePercentage >= 80
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : scorePercentage >= 50
                                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                                  }`}>
                                    Điểm: {totalRubricScore}/{totalRubricMax}
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold">Chưa chấm</span>
                                )}
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="p-5 border-t border-slate-100 bg-white space-y-4 text-xs font-medium">
                                <div>
                                  <h5 className="font-bold text-neutral-medium text-[10px] uppercase tracking-wider mb-1">Mô tả đề bài</h5>
                                  <p className="text-neutral-dark bg-slate-50/50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap font-semibold leading-relaxed">
                                    {sub.assignmentDescription}
                                  </p>
                                </div>
                                <div>
                                  <h5 className="font-bold text-neutral-medium text-[10px] uppercase tracking-wider mb-1">Nội dung bài làm</h5>
                                  <div className="text-neutral-dark bg-slate-50 p-4 rounded-xl border border-slate-100 overflow-x-auto font-mono text-[11px] whitespace-pre-wrap">
                                    {sub.submissionContent}
                                  </div>
                                </div>
                                {sub.finalScore !== null && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10 space-y-2">
                                      <h5 className="font-bold text-secondary text-[10px] uppercase tracking-wider flex items-center gap-1.5">
                                        <MessageSquare size={13} /> Góp ý & nhận xét của reviewer
                                      </h5>
                                      <p className="text-neutral-dark font-semibold leading-relaxed italic whitespace-pre-wrap">
                                        "{sub.comments || 'Không có nhận xét chi tiết.'}"
                                      </p>
                                    </div>
                                    <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-2">
                                      <h5 className="font-bold text-neutral-medium text-[10px] uppercase tracking-wider">
                                        Chi tiết tiêu chí đánh giá (Rubrics)
                                      </h5>
                                      {sub.criteriaScores?.length > 0 ? (
                                        <div className="space-y-1.5">
                                          {sub.criteriaScores.map((criterion, cIdx) => (
                                            <div key={cIdx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                                              <div>
                                                <p className="font-bold text-neutral-dark text-[11px]">{criterion.criterionName}</p>
                                                <p className="text-[9px] text-neutral-medium">{criterion.description}</p>
                                              </div>
                                              <span className="font-black text-secondary text-[11px] bg-secondary/10 px-2 py-0.5 rounded-md">
                                                {criterion.score}/{criterion.maxPoint}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-neutral-light italic text-[11px]">Không có thông tin rubrics chi tiết.</p>
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
                  <span className="text-neutral-medium text-xs font-bold mr-2">Trạng thái hiện tại:</span>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="px-4 py-2.5 border border-gray-200 hover:bg-slate-100 text-neutral-medium rounded-xl font-bold cursor-pointer transition-colors active:scale-95 text-xs"
                  >
                    Đóng
                  </button>
                  {selectedApp.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => setIsRejectOpen(true)}
                        disabled={isSubmitting}
                        className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold cursor-pointer transition-colors active:scale-95 disabled:opacity-50 text-xs"
                      >
                        Từ chối đơn
                      </button>
                      <button
                        onClick={() => handleApprove(selectedApp.id)}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl font-bold shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 text-xs"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
            </>
          )}
        </DialogContent>
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
              onClick={() => { setIsRejectOpen(false); setRejectReason('') }}
              className="p-1 hover:bg-gray-100 rounded-lg cursor-pointer text-gray-500"
            >
              <X size={16} />
            </button>
          </header>
          <form onSubmit={handleRejectSubmit}>
            <div className="p-5 space-y-4">
              <p className="text-xs text-neutral-medium leading-relaxed font-semibold">
                Vui lòng cung cấp lý do chi tiết từ chối để gửi lại cho học viên{' '}
                <span className="font-bold text-neutral-dark">{selectedApp?.userName}</span>.
                Điều này giúp họ hiểu những gì cần cải thiện.
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
                onClick={() => { setIsRejectOpen(false); setRejectReason('') }}
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
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
