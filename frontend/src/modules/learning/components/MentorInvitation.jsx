import { useState } from "react"
import { Award, Calendar, Gift, CheckCircle, Info } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import mentorService from "@/services/mentorService"

export const MentorInvitation = ({ isOpen, onClose, classId }) => {
  const { user } = useAuth()
  const userName = user?.fullName || "Lê Hoàng Nam"
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBecomeMentor = async () => {
    setIsSubmitting(true)
    try {
      await mentorService.applyToBecomeMentor(classId)
      toast.success("Đăng ký ứng tuyển Mentor thành công!", {
        description: "Chúng tôi sẽ xem xét thành tích học tập và liên hệ sớm nhất.",
      })
      onClose()
    } catch (error) {
      toast.error(error.message || "Đăng ký làm Mentor thất bại!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>

      {/* Mentor Invitation Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-card rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 border border-slate-100 text-left">
            {/* Modal Header */}
            <header className="bg-neutral-dark p-8 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Award className="text-[#6ef8e7] w-8 h-8" />
              </div>
              <h2 className="text-lg md:text-xl font-extrabold text-white leading-tight">
                Trở thành Mentor thế hệ tiếp theo, tại sao không?
              </h2>
            </header>
            
            {/* Modal Body */}
            <div className="p-8 space-y-6">
              <p className="text-xs md:text-sm leading-relaxed text-neutral-medium text-center font-medium">
                Chúc mừng <strong className="text-primary font-bold">{userName}</strong>, với thành tích học tập xuất sắc và sự tương tác tích cực trong khóa học vừa qua, bạn hoàn toàn đủ điều kiện để trở thành Mentor dẫn dắt các bạn học viên khóa sau.
              </p>

              {/* Two-column benefits & commitments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Column 1: Benefits */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Gift size={16} />
                    <span>Bạn sẽ nhận được</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs font-semibold text-neutral-dark">
                      <CheckCircle className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                      <span>Badge Mentor danh giá trên profile</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-neutral-dark">
                      <CheckCircle className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                      <span>Củng cố kiến thức chuyên sâu</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-neutral-dark">
                      <CheckCircle className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                      <span>Mở rộng Network cùng các chuyên gia</span>
                    </li>
                  </ul>
                </div>

                {/* Column 2: Commitments */}
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                    <Calendar size={16} />
                    <span>Cam kết của bạn</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs font-semibold text-neutral-dark">
                      <Info className="text-secondary w-4 h-4 shrink-0 mt-0.5" />
                      <span>Đồng hành tối đa 2 lớp/tháng</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-neutral-dark">
                      <Info className="text-secondary w-4 h-4 shrink-0 mt-0.5" />
                      <span>Hỗ trợ giải đáp & chấm điểm học viên</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs font-semibold text-neutral-dark">
                      <Info className="text-secondary w-4 h-4 shrink-0 mt-0.5" />
                      <span>Thời gian linh hoạt theo lịch cá nhân</span>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-2 pt-2">
                <button 
                  onClick={handleBecomeMentor}
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-secondary hover:bg-secondary/95 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    "Sẵn sàng trở thành Mentor"
                  )}
                </button>
                <button 
                  onClick={onClose}
                  className="text-neutral-medium text-xs font-bold hover:text-primary transition-colors py-2 cursor-pointer w-full text-center"
                >
                  Để sau nhé
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MentorInvitation
