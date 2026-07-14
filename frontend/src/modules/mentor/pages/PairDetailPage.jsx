import { useParams, Link } from 'react-router'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import usePairDetail from '../hooks/usePairDetail'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

// Import relocated subcomponents
import PairProfileCard from '../components/mentor-pair/PairProfileCard'
import PairActivityHistory from '../components/mentor-pair/PairActivityHistory'

const PairDetailPage = () => {
  const { id } = useParams()
  const {
    pairDetail,
    isLoading,
    chatMessages,
    isChatLoading
  } = usePairDetail(id)

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!pairDetail) {
    return (
      <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-neutral-dark mb-2">
          Không tìm thấy cặp đôi học tập
        </h2>
        <Link
          to="/mentor/classes"
          className="text-primary hover:underline text-sm font-semibold"
        >
          Quay lại quản lý lớp học
        </Link>
      </div>
    )
  }

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button & Header */}
      <div className="mb-6">
        <Link
          to={`/mentor/classes`}
          className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold mb-4 transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Quay lại chi tiết lớp</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                Chi tiết Cặp đôi: {pairDetail.student1.name} &{' '}
                {pairDetail.student2.name}
              </h1>
              <Badge
                variant={
                  pairDetail.status === 'SLOW' ? 'destructive' : 'approved'
                }
                className="font-bold tracking-wider text-[10px]"
              >
                {pairDetail.status === 'SLOW'
                  ? 'Học chậm (Slow)'
                  : 'Hoạt động tốt'}
              </Badge>
            </div>
            <p className="text-sm text-neutral-medium mt-1">
              Phân thuộc Lớp học:{' '}
              <span className="font-semibold text-neutral-dark">
                {pairDetail.className}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid 6:4 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column (6): Partner Details & Activity */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Pair Profiles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PairProfileCard
              student={pairDetail.student1}
              roleLabel="Học viên A"
            />
            <PairProfileCard
              student={pairDetail.student2}
              roleLabel="Học viên B"
            />
          </div>

          {/* Activity Metrics & Progress */}
          <Card className="border border-border-light/35 shadow-sm">
            <CardHeader className="border-b border-border-light/20 pb-4">
              <CardTitle className="text-base font-bold text-neutral-dark">
                Tiến trình học tập
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Average Progress */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-medium mb-2">
                  <span>Tiến độ học tập trung bình của cặp</span>
                  <span className="text-neutral-dark font-extrabold">
                    {pairDetail.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      pairDetail.status === 'SLOW' ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${pairDetail.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Student 1 Progress */}
              {pairDetail.student1 && (
                <div className="pt-2 border-t border-slate-50">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-medium mb-2">
                    <span>Tiến độ của {pairDetail.student1.name} (Học viên A)</span>
                    <span className="text-neutral-dark font-bold">
                      {pairDetail.student1.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
                      style={{ width: `${pairDetail.student1.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Student 2 Progress */}
              {pairDetail.student2 && (
                <div className="pt-2 border-t border-slate-50">
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-medium mb-2">
                    <span>Tiến độ của {pairDetail.student2.name} (Học viên B)</span>
                    <span className="text-neutral-dark font-bold">
                      {pairDetail.student2.progress || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-sky-500 transition-all duration-300"
                      style={{ width: `${pairDetail.student2.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (4): Chat & Warnings */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Chat Component */}
          <PairActivityHistory
            status={pairDetail.status}
            chatMessages={chatMessages}
            isChatLoading={isChatLoading}
            student1={pairDetail.student1}
            student2={pairDetail.student2}
          />

          {/* Quick info / Warning panel */}
          {pairDetail.status === 'SLOW' && (
            <Card className="border border-red-200 bg-red-50 text-red-900 shadow-sm p-5">
              <div className="flex gap-2">
                <ShieldAlert
                  className="text-red-600 shrink-0 mt-0.5"
                  size={18}
                />
                <div>
                  <h4 className="font-bold text-sm text-red-800">
                    Cần cứu trợ ngay!
                  </h4>
                  <p className="text-xs text-red-700 mt-1 leading-relaxed">
                    Cặp đôi này đang ở trạng thái học chậm. Học viên B cần phản
                    hồi kịp thời để tránh bị hệ thống đình chỉ hoặc chuyển trạng
                    thái sang Broken Pair.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default PairDetailPage
