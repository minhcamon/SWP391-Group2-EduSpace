import { useNavigate } from "react-router"
import { Lock, FileText, CheckCircle2, ArrowLeft, Menu, MessageSquare, Send, X } from "lucide-react"
import useAssignment from "../hooks/useAssignment"
import Badge from "@/components/ui/Badge"
import Breadcrumbs from "@/components/common/Breadcrumbs"
import AssignmentWork from "../components/AssignmentWork"
import ResultReview from "../components/ResultReview"
import CourseSidebar from "../components/CourseSidebar"
import StudyGroup from "../components/StudyGroup"
import Avatar from "@/components/common/Avatar"
import ReloadButton from "@/components/ui/ReloadButton"

export const AssignmentPage = () => {
  const navigate = useNavigate()
  const {
    classId,
    assignmentId,
    activeTab,
    setActiveTab,
    isLoading,
    assignmentDetails,
    essay,
    wordCount,
    isSubmitting,
    isSubmitted,
    isGraded,
    peerReviewPending,
    myReviewResult,
    peerReviewTask,
    peerReviewGraded,
    handleEssayChange,
    handleSubmitDraft,
    submitPeerReview,
    partnerAvatar,
    progressDashboard,
    isSidebarOpen,
    setIsSidebarOpen,
    isChatSidebarOpen,
    setIsChatSidebarOpen,
    isGroupListOpen,
    setIsGroupListOpen,
    selectedPartner,
    setSelectedPartner,
    messages,
    inputText,
    setInputText,
    handleSendMessage,
    courseTitle,
    courseId,
    sidebarSections,
    studyGroup,
    progressPercent,
    activeModule,
    handleReload,
  } = useAssignment()

  if (isLoading) {
    return (
      <div className='grow flex items-center justify-center min-h-125'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin' />
          <span className='text-sm font-semibold text-neutral-medium'>
            Đang tải thông tin bài tập...
          </span>
        </div>
      </div>
    )
  }

  // Determine dynamic badge status
  let statusText = "Chưa nộp bài"
  if (isGraded) {
    statusText = "Đã được chấm điểm"
  } else if (isSubmitted) {
    statusText = "Đã nộp bài (Đang chờ chấm chéo)"
  }

  return (
    <div className='h-screen w-full flex flex-col overflow-hidden bg-bg-base text-neutral-dark'>
      {/* Header Area */}
      <header className='bg-white border-b border-border-light shrink-0 z-30 h-16 flex items-center justify-between px-6 shadow-sm'>
        <div className='flex items-center gap-4'>
          <button
            onClick={() => navigate(`/classes/${classId}`)}
            className='flex items-center gap-2 text-primary hover:text-primary/80 transition-all cursor-pointer font-semibold'
          >
            <ArrowLeft size={20} />
            <span className='text-sm hidden md:inline'>Quay lại lớp học</span>
          </button>
          <div className='h-6 w-px bg-border-light mx-2 hidden md:block'></div>
          <h1 className='text-lg font-bold text-neutral-dark truncate max-w-[200px] sm:max-w-xs md:max-w-md'>
            {courseTitle || "Bài tập"}
          </h1>
        </div>

        <div className='flex items-center gap-6'>
          {/* Collapsible Chat Button */}
          {activeModule?.studyGroupId && (
            <button
              onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold cursor-pointer ${
                isChatSidebarOpen
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-bg-card border-border-light/70 text-neutral-medium hover:text-primary hover:border-primary hover:bg-hover-light"
              }`}
            >
              <MessageSquare size={14} />
              <span className='hidden sm:inline'>Thảo luận nhóm</span>
              <span className='bg-white/20 text-current rounded-full px-1.5 py-0.5 text-[10px]'>
                {messages.length}
              </span>
            </button>
          )}

          {/* Study Group Component (Overlapped Avatars Stack & Modals) */}
          {studyGroup.length > 0 && (
            <StudyGroup
              studyGroup={studyGroup}
              onOpenChat={() => setIsChatSidebarOpen(true)}
              selectedPartner={selectedPartner}
              setSelectedPartner={setSelectedPartner}
              isGroupListOpen={isGroupListOpen}
              setIsGroupListOpen={setIsGroupListOpen}
            />
          )}

          <div className='hidden md:flex items-center gap-3'>
            <span className='text-xs font-semibold text-neutral-medium'>Tiến độ</span>
            <Badge variant={progressPercent === 100 ? "approved" : "secondary"}>
              {progressPercent}% Hoàn thành
            </Badge>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className='md:hidden p-1.5 rounded-lg hover:bg-hover-light transition-all text-neutral-medium hover:text-primary cursor-pointer'
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className='flex-1 flex overflow-hidden relative'>
        {/* Left Course Sidebar */}
        <CourseSidebar
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          isCompleted={progressPercent === 100}
          sidebarSections={sidebarSections}
          onSelectLesson={(lessonId) => {
            if (courseId) {
              navigate(`/courses/${courseId}/learn?lessonId=${lessonId}`)
            } else {
              navigate(`/my-learning`)
            }
          }}
          onSelectAssignment={(asgId) => {
            if (asgId.toString() !== assignmentId?.toString()) {
              navigate(`/classes/${classId}/assignments/${asgId}`)
            }
          }}
        />

        {/* Main Content Area */}
        <div className='grow flex flex-col overflow-y-auto min-w-0 bg-white z-10'>
          <div className='py-6 px-4 md:px-8 w-full flex flex-col gap-6 max-w-7xl mx-auto grow'>
            {/* Breadcrumbs Navigation */}
            {/* <Breadcrumbs */}
            {/* items={[ */}
            {/* { label: "Khóa học", to: "/courses" }, */}
            {/* { label: "Lớp học", to: `/classes/${classId}` }, */}
            {/* { label: assignmentDetails?.title || "Bài tập" }, */}
            {/* ]} */}
            {/* className='mb-2' */}
            {/* /> */}

            {/* Title & Info Section */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light/25 pb-6'>
              <div>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1'>
                    <FileText className='w-3.5 h-3.5' /> Bài tập bắt buộc
                  </span>
                </div>
                <h1 className='text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight'>
                  {assignmentDetails?.title}
                </h1>
                <p className='text-sm text-neutral-medium mt-1'>
                  Thực hiện nộp bài tập và tiến hành đánh giá chéo (Peer Review) cùng bạn học để mở
                  rộng kiến thức.
                </p>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                <Badge
                  variant='roletag'
                  className='py-1.5 px-4 rounded-full text-xs font-bold flex items-center gap-1.5'
                >
                  {isGraded && <CheckCircle2 className='w-3.5 h-3.5 text-success' />}
                  Trạng thái: {statusText}
                </Badge>
              </div>
            </div>

            {/* Tab Selectors */}
            <div className='flex border-b border-border-light/35 justify-between items-center'>
              <div className='flex'>
                <button
                  onClick={() => setActiveTab("assignment")}
                  className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all cursor-pointer ${
                    activeTab === "assignment"
                      ? "border-primary text-primary font-bold"
                      : "border-transparent text-neutral-medium hover:text-primary"
                  }`}
                >
                  1. Bài tập của bạn
                </button>
                <button
                  disabled={!isSubmitted}
                  onClick={() => isSubmitted && setActiveTab("review")}
                  title={!isSubmitted ? "Vui lòng nộp bài viết trước để mở khóa đánh giá chéo" : ""}
                  className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-1.5 ${
                    !isSubmitted
                      ? "border-transparent text-neutral-medium/50 cursor-not-allowed"
                      : activeTab === "review"
                        ? "border-primary text-primary font-bold cursor-pointer"
                        : "border-transparent text-neutral-medium hover:text-primary cursor-pointer"
                  }`}
                >
                  {!isSubmitted && <Lock className='w-3.5 h-3.5 text-neutral-medium/40' />}
                  2. Đối chiếu & Đánh giá chéo
                </button>
              </div>

              <div className='pb-1 pr-1'>
                <ReloadButton action={handleReload} isLoading={isLoading} />
              </div>
            </div>

            {/* Tab Panel Content */}
            <div className='grow'>
              {activeTab === "assignment" ? (
                <AssignmentWork
                  assignmentDetails={assignmentDetails}
                  essay={essay}
                  handleEssayChange={handleEssayChange}
                  isSubmitted={isSubmitted}
                  wordCount={wordCount}
                  handleSubmitDraft={handleSubmitDraft}
                  isSubmitting={isSubmitting}
                  peerReviewTask={peerReviewTask}
                  partnerAvatar={partnerAvatar}
                />
              ) : (
                <ResultReview
                  key={peerReviewTask?.reviewId || "no-review"}
                  isSubmitted={isSubmitted}
                  isGraded={isGraded}
                  peerReviewPending={peerReviewPending}
                  myReviewResult={myReviewResult}
                  peerReviewTask={peerReviewTask}
                  peerReviewGraded={peerReviewGraded}
                  submitPeerReview={submitPeerReview}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Chat Sidebar */}
        {activeModule?.studyGroupId && (
          <div
            className={`shrink-0 h-full border-l border-border-light bg-bg-sidebar/90 backdrop-blur-md flex flex-col transition-all duration-300 z-30 ${
              isChatSidebarOpen
                ? "w-[300px] sm:w-[350px] translate-x-0"
                : "w-0 translate-x-full md:translate-x-0 overflow-hidden border-l-0"
            }`}
          >
            {/* Chat Header */}
            <div className='p-4 border-b border-border-light flex items-center justify-between bg-white shrink-0'>
              <div className='flex items-center gap-2'>
                <MessageSquare
                  size={16}
                  className='text-primary'
                />
                <h3 className='font-bold text-sm text-neutral-dark'>Trò chuyện nhóm</h3>
              </div>
              <button
                onClick={() => setIsChatSidebarOpen(false)}
                className='p-1 rounded hover:bg-hover-light text-neutral-medium cursor-pointer'
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages List */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.isMe ? "flex-row-reverse" : "flex-row"}`}
                >
                  {!msg.isMe && (
                    <div
                      onClick={() => {
                        const p = studyGroup.find(
                          (m) =>
                            m.name === msg.sender || msg.sender.startsWith(m.name.split(" ")[0]),
                        )
                        if (p) setSelectedPartner(p)
                      }}
                      className='cursor-pointer hover:scale-105 transition-transform shrink-0'
                      title={`Xem hồ sơ của ${msg.sender}`}
                    >
                      <Avatar
                        src={msg.avatar}
                        alt={msg.sender}
                        className='w-8 h-8 border border-border-light/20 shadow-sm'
                      />
                    </div>
                  )}
                  {msg.isMe && (
                    <div className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20 shadow-sm'>
                      ME
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl shadow-xs text-xs leading-relaxed ${
                        msg.isMe
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-white text-neutral-dark rounded-tl-none border border-border-light/35"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className='text-[9px] text-neutral-light mt-1 block px-1'>
                      {msg.sender} • {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={handleSendMessage}
              className='p-3 bg-white border-t border-border-light flex gap-2 shrink-0'
            >
              <input
                type='text'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='Nhập tin nhắn...'
                className='grow bg-bg-base border border-border-light rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary focus:bg-white transition-all'
              />
              <button
                type='submit'
                className='bg-primary hover:bg-primary/95 text-white p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0'
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default AssignmentPage
