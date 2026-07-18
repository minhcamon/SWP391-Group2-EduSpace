import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { ArrowLeft, ShieldAlert, Play, MessageSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import useClassDetail from '../hooks/useClassDetail'

// Import extracted presenter components from subdirectories
import ClassDetailHero from '../components/mentor-class/ClassDetailHero'
import StudyGroupsList from '../components/mentor-class/StudyGroupsList'
import SidebarModuleTimeline from '../components/mentor-class/SidebarModuleTimeline'
import WithdrawRequestModal from '../components/mentor-dashboard/WithdrawRequestModal'

const ClassDetailPage = () => {
  const { classId } = useParams()
  const [isWithdrawOpen, setIsWithdrawOpen] = React.useState(false)
  const {
    classDetail,
    pairs,
    modules,
    isLoading,
    selectedModuleId,
    setSelectedModuleId,
    isStartingModule,
    handleReminderClick,
    handleStartNextModule
  } = useClassDetail(classId)

  const selectedModuleRef = React.useRef(null)

  useEffect(() => {
    if (selectedModuleRef.current) {
      selectedModuleRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      })
    }
  }, [selectedModuleId])

  const handlePrevModule = () => {
    const idx = modules.findIndex((m) => m.id === selectedModuleId)
    if (idx > 0) {
      setSelectedModuleId(modules[idx - 1].id)
    }
  }

  const handleNextModule = () => {
    const idx = modules.findIndex((m) => m.id === selectedModuleId)
    if (idx !== -1 && idx < modules.length - 1) {
      setSelectedModuleId(modules[idx + 1].id)
    }
  }

  const getSelectedModuleDetails = () => {
    const m = modules.find((mod) => mod.id === selectedModuleId)
    if (!m) return null

    if (m.contents && m.contents.length > 0) {
      return m
    }

    // Custom contents mapping for rendering module lessons/assignments fallback
    const contents = {
      1: [
        { type: 'Bài học', name: 'Giới thiệu Spring Boot Ecosystem & Maven' },
        {
          type: 'Thực hành',
          name: 'Thiết lập môi trường & Tạo Hello Controller'
        },
        { type: 'Bài tập', name: 'Viết REST API đầu tiên trả về JSON' }
      ],
      2: [
        { type: 'Bài học', name: 'Spring Data JPA & Entity Lifecycle' },
        {
          type: 'Thực hành',
          name: 'Cấu hình Datasource & Viết JPA Repository'
        },
        { type: 'Bài tập', name: 'Liên kết Quan hệ One-to-Many & Many-to-Many' }
      ],
      3: [
        {
          type: 'Bài học',
          name: 'Spring Security Architecture & Filter Chain'
        },
        { type: 'Thực hành', name: 'Tích hợp JWT & Phân quyền User' },
        { type: 'Bài tập', name: 'Bảo mật các endpoint Spring REST API' }
      ],
      4: [
        { type: 'Bài học', name: 'Kiểm thử Unit Test & Integration Test' },
        { type: 'Thực hành', name: 'Dockerize Ứng dụng Spring Boot' },
        { type: 'Bài tập', name: 'CI/CD Deployment lên Server' }
      ]
    }

    return {
      ...m,
      contents: contents[m.id] || []
    }
  }

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-100">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!classDetail) {
    return (
      <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-neutral-dark mb-2">
          Không tìm thấy lớp học
        </h2>
        <Link
          to="/mentor/classes"
          className="text-primary hover:underline text-sm font-semibold"
        >
          Quay lại danh sách lớp học
        </Link>
      </div>
    )
  }

  const activeModule =
    modules.find((m) => m.status === 'ACTIVE') ||
    modules.find((m) => m.status !== 'COMPLETED') ||
    modules[modules.length - 1]
  const nextModule = modules.find((m) => m.status === 'LOCKED')
  const showReminder =
    activeModule &&
    activeModule.status === 'ACTIVE' &&
    activeModule.completionRate >= 80

  return (
    <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Back button & Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/mentor/classes"
          className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Quay lại Quản lý Lớp học</span>
        </Link>

        {classDetail.status !== 'INACTIVE' && (
          <button
            onClick={() => setIsWithdrawOpen(true)}
            className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.98]"
          >
            <ShieldAlert size={14} />
            <span>Xin rút khỏi lớp</span>
          </button>
        )}
      </div>

      {/* Hero Class Banner */}
      <ClassDetailHero
        classDetail={classDetail}
        activeModule={activeModule}
        totalModules={modules.length}
      />

      {/* Main Grid: 7:3 */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
        {/* Left Column (7): Study Groups & System Alerts */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* System Reminder alert */}
          {showReminder && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-all duration-300">
              <ShieldAlert
                className="text-amber-600 shrink-0 mt-0.5"
                size={20}
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-amber-800">
                  Cảnh báo hệ thống: Kích hoạt học phần mới
                </h4>
                <p className="text-xs text-amber-700 font-semibold mt-1 leading-relaxed">
                  Lớp học hiện tại đã hoàn thành khóa học phần{' '}
                  <span className="font-bold text-amber-900">
                    "{activeModule.title}"
                  </span>{' '}
                  đạt tỷ lệ{' '}
                  <span className="font-bold text-amber-900">
                    {activeModule.completionRate}%
                  </span>
                  . Bạn cần chuẩn bị kích hoạt học phần mới để tránh làm trễ
                  tiến độ của lớp học.
                </p>
                {nextModule && (
                  <button
                    onClick={() =>
                      handleStartNextModule(nextModule.id, nextModule.title)
                    }
                    disabled={isStartingModule}
                    className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play size={12} />
                    <span>
                      {isStartingModule
                        ? 'Đang xử lý...'
                        : `Bắt đầu ${nextModule.title.split(':')[0]}`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Study Groups List */}
          <StudyGroupsList
            pairs={pairs}
            handleSendReminder={handleReminderClick}
          />
        </div>

        {/* Right Column (3): Swipeable Modules & Quick Actions */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Interactive Modules Timeline Card */}
          <SidebarModuleTimeline
            modules={modules}
            selectedModuleId={selectedModuleId}
            setSelectedModuleId={setSelectedModuleId}
            selectedModuleRef={selectedModuleRef}
            nextModule={nextModule}
            isStartingModule={isStartingModule}
            handleStartNextModule={handleStartNextModule}
            getSelectedModuleDetails={getSelectedModuleDetails}
            handlePrevModule={handlePrevModule}
            handleNextModule={handleNextModule}
          />

          {/* Quick Actions Panel */}
          {/* <Card className="border border-border-light/35 shadow-sm bg-slate-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-neutral-dark uppercase tracking-wider">Hành động nhanh</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-3">
                            <Link
                                to={`/mentor/chat?classId=${classId}`}
                                className="w-full py-2.5 bg-white border border-border-light hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm text-neutral-dark"
                            >
                                <MessageSquare size={14} />
                                <span>Nhắn tin tập thể lớp</span>
                            </Link>
                        </CardContent>
                    </Card> */}
        </div>
      </div>
      <WithdrawRequestModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        classId={classId}
        className={classDetail.name}
        onSubmitted={() => {
          window.location.reload();
        }}
      />
    </div>
  )
}

export default ClassDetailPage
