import { useEffect, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { MessageSquare } from 'lucide-react'
import Avatar from '@/components/common/Avatar'
import { useAuth } from '@/contexts/AuthContext'

const PairActivityHistory = ({
  chatMessages = [],
  isChatLoading = false,
  student1,
  student2
}) => {
  const scrollRef = useRef(null)
  const { user } = useAuth()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [chatMessages])

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return ''
    }
  }

  return (
    <Card className="border border-border-light/35 shadow-sm flex flex-col grow min-h-100">
      <CardHeader className="border-b border-border-light/20 pb-4 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-base font-bold text-neutral-dark flex items-center gap-2">
          <MessageSquare
            size={18}
            className="text-primary"
          />
          <span>Hội thoại của Cặp đôi</span>
        </CardTitle>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Thời gian thực
        </span>
      </CardHeader>

      <CardContent className="p-0 grow flex flex-col overflow-hidden bg-slate-50/50">
        {isChatLoading ? (
          <div className="grow flex flex-col items-center justify-center gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] text-neutral-medium font-bold">
              Đang tải lịch sử trò chuyện...
            </span>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="grow flex flex-col items-center justify-center text-center p-8 text-neutral-medium gap-2">
            <MessageSquare className="w-10 h-10 text-slate-300" />
            <p className="text-xs font-bold">Chưa có tin nhắn thảo luận nào</p>
            <p className="text-[10px] font-semibold text-neutral-light">
              Cặp học viên này chưa bắt đầu trò chuyện trong buổi học này.
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
          >
            {chatMessages.map((msg, idx) => {
              const isCurrentUser =
                user && msg.senderUserId?.toString() === user.id?.toString()
              const isStudent2 =
                student2 &&
                msg.senderUserId?.toString() === student2.userId?.toString()
              const senderAvatar =
                msg.senderAvatar ||
                (isCurrentUser
                  ? user?.avatarUrl
                  : isStudent2
                    ? student2?.avatarUrl
                    : student1?.avatarUrl)

              return (
                <div
                  key={msg.id || idx}
                  className={`flex gap-2.5 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar
                    src={senderAvatar}
                    alt={msg.senderName}
                    className="w-8 h-8 shrink-0 ring-1 ring-slate-100 shadow-2xs"
                  />
                  <div
                    className={`max-w-[70%] flex flex-col ${
                      isCurrentUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed shadow-3xs ${
                        isCurrentUser
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-white text-neutral-dark rounded-tl-none border border-slate-100'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <span className="text-[9px] text-neutral-medium mt-1 font-bold px-1 block">
                      {msg.senderName} • {formatDate(msg.sendAt)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PairActivityHistory
