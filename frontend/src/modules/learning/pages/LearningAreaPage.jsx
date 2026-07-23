import {
  ArrowLeft,
  Menu,
  Clock,
  CheckCircle,
  MessageSquare,
  Send,
  X,
  LifeBuoy
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import VideoPlayer from '../components/VideoPlayer'
import PairChat from '../components/PairChat'
import CourseSidebar from '../components/CourseSidebar'
import StudyGroup from '../components/StudyGroup'
import FloatingMentorSupport from '../components/FloatingMentorSupport'
import useLearningArea from '../hooks/useLearningArea'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/common/Avatar'

const LearningAreaPage = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    isChatSidebarOpen,
    setIsChatSidebarOpen,
    isGroupListOpen,
    setIsGroupListOpen,
    selectedPartner,
    setSelectedPartner,
    activeTab,
    setActiveTab,
    isSynced,
    setIsSynced,
    isPlaying,
    setIsPlaying,
    isCompleted,
    messages,
    inputText,
    setInputText,
    sharedNotes,
    setSharedNotes,
    materials,
    handleSendMessage,
    handleMarkCompleted,
    handleExit,
    isLoading,
    courseTitle,
    studyGroup,
    lesson,
    sidebarSections,
    handleSelectLesson,
    handleSelectAssignment,
    progressPercent,
    resolvedClassId,
    courseId,
    studyGroupId
  } = useLearningArea()


  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-bg-base">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-neutral-medium">
            Đang tải dữ liệu EduSpace...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg-base text-neutral-dark">
      {/* Header Area */}
      <header className="bg-white border-b border-border-light shrink-0 z-30 h-16 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all cursor-pointer font-semibold"
          >
            <ArrowLeft size={20} />
            <span className="text-sm hidden md:inline">Thoát bài học</span>
          </button>
          <div className="h-6 w-px bg-border-light mx-2 hidden md:block"></div>
          <h1 className="text-lg font-bold text-neutral-dark truncate max-w-[200px] sm:max-w-xs md:max-w-md">
            {courseTitle}
          </h1>
        </div>

        <div className="flex items-center gap-6">

          {/* Collapsible Chat Button */}
          <button
            onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold cursor-pointer ${
              isChatSidebarOpen
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-bg-card border-border-light/70 text-neutral-medium hover:text-primary hover:border-primary hover:bg-hover-light'
            }`}
          >
            <MessageSquare size={14} />
            <span className="hidden sm:inline">Thảo luận nhóm</span>
            <span className="bg-white/20 text-current rounded-full px-1.5 py-0.5 text-[10px]">
              {messages.length}
            </span>
          </button>

          {/* Study Group Component (Overlapped Avatars Stack & Modals) */}
          <StudyGroup
            studyGroup={studyGroup}
            onOpenChat={() => setIsChatSidebarOpen(true)}
            selectedPartner={selectedPartner}
            setSelectedPartner={setSelectedPartner}
            isGroupListOpen={isGroupListOpen}
            setIsGroupListOpen={setIsGroupListOpen}
          />

          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-semibold text-neutral-medium">
              Tiến độ
            </span>
            <Badge variant={progressPercent === 100 ? 'approved' : 'secondary'}>
              {progressPercent}% Hoàn thành
            </Badge>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-hover-light transition-all text-neutral-medium hover:text-primary cursor-pointer"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left Course Sidebar */}
        <CourseSidebar
          isSidebarOpen={isSidebarOpen}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          isCompleted={isCompleted}
          sidebarSections={sidebarSections}
          onSelectLesson={handleSelectLesson}
          onSelectAssignment={handleSelectAssignment}
        />

        {/* Main Content Area (Video & Tabs) */}
        <div className="grow flex flex-col overflow-y-auto min-w-0 bg-white z-10">
          <div className="py-6 px-4 md:px-8 w-full flex flex-col gap-6">
            <VideoPlayer
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              isSynced={isSynced}
              onToggleSync={() => setIsSynced(!isSynced)}
              lesson={lesson}
            />

            {/* Lesson Title & Desc */}
            {lesson && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs font-bold">
                    {lesson.module}
                  </span>
                  <span className="text-neutral-light text-xs font-semibold flex items-center gap-1">
                    <Clock size={14} /> {lesson.duration}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-neutral-dark">
                  {lesson.title}
                </h2>
                <p className="text-neutral-medium text-sm leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            )}

            {/* <PairChat
              activeTab={activeTab}
              onTabChange={setActiveTab}
              sharedNotes={sharedNotes}
              onNotesChange={(e) => setSharedNotes(e.target.value)}
              materials={materials}
              onDownloadMaterial={(file) =>
                toast.success(`Đang tải file ${file.name}`)
              }
            /> */}

            {/* Mark completed block */}
            <div className="mt-6 py-6 border-t border-border-light flex flex-col items-center gap-4 text-center">
              <div className="max-w-md">
                <p className="text-sm text-neutral-medium mb-4">
                  Bạn và nhóm của mình đã hoàn thành buổi học này chứ? Đánh dấu
                  hoàn thành để cập nhật tiến độ sang bài tiếp theo.
                </p>
                <button
                  onClick={handleMarkCompleted}
                  disabled={isCompleted}
                  className={`w-full py-3.5 px-8 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-hover-light/60 text-neutral-light cursor-not-allowed border border-border-light/40'
                      : 'bg-secondary text-white hover:shadow-md hover:bg-secondary/90 hover:scale-[1.01]'
                  }`}
                >
                  <CheckCircle size={18} />
                  {isCompleted
                    ? 'Bài học đã hoàn thành'
                    : 'Đánh dấu hoàn thành bài học'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Chat Sidebar */}
        <div
          className={`shrink-0 h-full border-l border-border-light bg-bg-sidebar/90 backdrop-blur-md flex flex-col transition-all duration-300 z-30 ${
            isChatSidebarOpen
              ? 'w-[300px] sm:w-[350px] translate-x-0'
              : 'w-0 translate-x-full md:translate-x-0 overflow-hidden border-l-0'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-border-light flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare
                size={16}
                className="text-primary"
              />
              <h3 className="font-bold text-sm text-neutral-dark">
                Trò chuyện nhóm
              </h3>
            </div>
            <button
              onClick={() => setIsChatSidebarOpen(false)}
              className="p-1 rounded hover:bg-hover-light text-neutral-medium cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!msg.isMe && (
                  <div
                    onClick={() => {
                      const p = studyGroup.find(
                        (m) =>
                          m.name === msg.sender ||
                          msg.sender.startsWith(m.name.split(' ')[0])
                      )
                      if (p) setSelectedPartner(p)
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform shrink-0"
                    title={`Xem hồ sơ của ${msg.sender}`}
                  >
                    <Avatar
                      src={msg.avatar}
                      alt={msg.sender}
                      className="w-8 h-8 border border-border-light/20 shadow-sm"
                    />
                  </div>
                )}
                {msg.isMe && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary/20 shadow-sm">
                    ME
                  </div>
                )}
                <div
                  className={`max-w-[75%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-3 rounded-2xl shadow-xs text-xs leading-relaxed ${
                      msg.isMe
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-neutral-dark rounded-tl-none border border-border-light/35'
                    }`}
                  >
                    {msg.videoTime && (
                      <span className="text-primary font-bold hover:underline cursor-pointer mr-1.5">
                        @{msg.videoTime}
                      </span>
                    )}
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-light mt-1 block px-1">
                    {msg.sender} • {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-border-light flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="grow bg-bg-base border border-border-light rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/95 text-white p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </main>

      {/* Floating Mentor Support Button */}
      <FloatingMentorSupport shiftLeft={isChatSidebarOpen} />
    </div>
  )
}

export default LearningAreaPage
