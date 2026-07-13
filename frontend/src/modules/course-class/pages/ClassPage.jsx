import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useClassDetails } from '../hooks/useClassDetails'
import ClassPersonnel from '../components/ClassPersonnel'
import ClassLeaderboard from '../components/ClassLeaderboard'
import MentorPairsMonitor from '../components/MentorPairsMonitor'
import MentorEvaluation from '../components/MentorEvaluation'
import { Users, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import Breadcrumbs from '@/components/common/Breadcrumbs'
import { useAuth } from '@/contexts/AuthContext'

export const ClassPage = () => {
  const { classId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { classData, isLoading, error, findStudyBuddy } =
    useClassDetails(classId)

  const searchParams = new URLSearchParams(window.location.search)
  const statusParam = searchParams.get('status')

  const isMentorOfThisClass =
    ((classId === 'L04' || classId === '1') && user?.username === 'mentor1') ||
    (classId === 'L05' && user?.username === 'mentor2')
  const isActualCreator = user?.role === 'CREATOR' || user?.role === 'ADMIN'
  const isCreator = isActualCreator || isMentorOfThisClass
  const isInStudyGroup = classData?.activePersonnel?.some((group) =>
    group.members?.some(
      (member) => member.id?.toString() === user?.id?.toString()
    )
  )
  const [activeTab, setActiveTab] = useState('leaderboard')

  const [leaderboardMode, setLeaderboardMode] = useState('individual')



  useEffect(() => {
    if (!isLoading && classData) {
      console.log('classData: ', classData)
    }
  }, [isLoading, classData, statusParam, navigate])

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-125">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-medium">
            Đang tải thông tin lớp học...
          </span>
        </div>
      </div>
    )
  }

  if (error || !classData) {
    console.log('error: ', error)
    console.log('classData: ', classData)
    return (
      <div className="grow flex items-center justify-center min-h-125 px-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-border-light/40 shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-danger mb-2">Đã xảy ra lỗi</h2>
          <p className="text-sm text-neutral-medium mb-6">
            {error || 'Không thể tìm thấy thông tin lớp học.'}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/95 transition-colors"
          >
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    )
  }

  const pairsMonitorData = (classData?.activePersonnel || []).map((p) => {
    const member1 = p.members?.[0] || {}
    const member2 = p.members?.[1] || {}
    return {
      id: p.id,
      name: p.pairName,
      status: p.status || 'ACTIVE',
      avatar1:
        member1.avatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      avatar2:
        member2.avatar ||
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
      lesson: 'Học phần hiện tại',
      progress: p.progress || 50
    }
  })



  return (
    <main className="grow flex flex-col w-full">
      {/* Main Section */}
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 grow">
        <Breadcrumbs
          items={[
            { label: 'Khóa học', to: '/courses' },
            {
              label: classData.courseTitle || 'Chi tiết',
              to: `/courses/${classData.courseId}`
            },
            { label: classData.cohortName || 'Lớp học' }
          ]}
          className="mb-4"
        />

        {/* Dashboard Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light/25 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                Cohort #{classData.classId || '104'}
              </span>
              <span className="text-xs text-neutral-light font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {classData.totalStudents || 0} Học viên hoạt động
              </span>
              {isCreator && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
                  <TrendingUp className="w-3.5 h-3.5" /> Hiệu suất lớp: 84% (+2.5%)
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
              {isActualCreator
                ? 'Bảng điều khiển Giảng viên'
                : isMentorOfThisClass
                  ? 'Bảng điều khiển Mentor'
                  : 'Bảng tin Lớp học'}
            </h1>
            <p className="text-sm text-neutral-medium mt-1">
              {isCreator
                ? 'Theo dõi tiến độ ghép cặp, xem kết quả làm bài tập và quản lý các hoạt động lớp.'
                : 'Cập nhật các hoạt động mới nhất và theo dõi bảng xếp hạng của lớp.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCreator && isInStudyGroup && (
              <button
                onClick={() =>
                  navigate(`/courses/${classData.courseId}/dashboard`)
                }
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Xem tiến trình học tập
              </button>
            )}
            <Badge
              variant="roletag"
              className="py-1.5 px-4 rounded-full text-xs font-bold"
            >
              Lớp hoạt động
            </Badge>
          </div>
        </div>

        {/* Unified Tabs Selector (Only for Creators) */}
        {isCreator && (
          <div className="flex border-b border-border-light/30 mb-6">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'leaderboard'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-neutral-medium hover:text-primary'
              }`}
            >
              Bảng xếp hạng
            </button>
            <button
              onClick={() => setActiveTab('pairs')}
              className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all ${
                activeTab === 'pairs'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-neutral-medium hover:text-primary'
              }`}
            >
              Theo dõi Cặp đôi
            </button>
            <button
              onClick={() => setActiveTab('evaluation')}
              className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'evaluation'
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-neutral-medium hover:text-primary'
              }`}
            >
              Duyệt bài tập
              <span className="px-1.5 py-0.5 bg-secondary text-white text-[10px] rounded-full font-bold">
                2
              </span>
            </button>
          </div>
        )}

        <div className="space-y-6 max-w-5xl">
          {activeTab === 'leaderboard' && (
            <>
              <ClassLeaderboard
                leaderboardMode={leaderboardMode}
                setLeaderboardMode={setLeaderboardMode}
                individualLeaderboard={
                  classData?.leaderboard?.individual || []
                }
                pairLeaderboard={classData?.leaderboard?.pairs || []}
              />
              <ClassPersonnel
                pairs={classData.activePersonnel}
                onFindBuddy={findStudyBuddy}
              />
            </>
          )}

          {isCreator && activeTab === 'pairs' && (
            <MentorPairsMonitor pairs={pairsMonitorData} />
          )}

          {isCreator && activeTab === 'evaluation' && <MentorEvaluation />}
        </div>
      </div>
    </main>
  )
}

export default ClassPage
