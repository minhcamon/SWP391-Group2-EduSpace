import { X, AlertCircle, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import learnService from '@/services/learnService'
import InputFile from '@/components/ui/InputFile'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/Dialog'

// Danh sách các loại incident từ backend enum
const INCIDENT_TYPES = [
  {
    value: 'ASSIGNMENT_DISPUTE',
    label: 'Tranh chấp bài tập / Yêu cầu chấm lại',
    description: 'Tranh chấp điểm số bài tập (bao gồm chấm chéo) hoặc yêu cầu chấm lại',
    requiresSubmission: true
  },
  {
    value: 'MEMBER_CONFLICT',
    label: 'Xung đột trong nhóm',
    description: 'Có xung đột với thành viên trong quá trình học',
    requiresUser: true
  },
  {
    value: 'SYSTEM_ERROR',
    label: 'Lỗi hệ thống',
    description: 'Gặp lỗi kỹ thuật trong hệ thống học tập',
    requiresEvidence: true
  },
  {
    value: 'INACTIVE_PARTNER',
    label: 'Bạn học không hoạt động',
    description: 'Partner không tham gia học tập hoặc không phản hồi',
    requiresUser: true
  },
  {
    value: 'RESCUE_SUPPORT_REQUEST',
    label: 'Yêu cầu hỗ trợ khẩn cấp',
    description: 'Tình huống khẩn cấp cần hỗ trợ ngay (hỏng máy, quên laptop,...)',
    isUrgent: true
  },
  {
    value: 'OTHER',
    label: 'Lý do khác',
    description: 'Các vấn đề khác cần sự hỗ trợ từ Mentor'
  }
]

const MentorSupportRequestModal = ({ isOpen, onClose, courseId, studyGroupId, studyGroup }) => {
  const [formData, setFormData] = useState({
    incidentType: '',
    reason: '',
    evidenceUrl: '',
    reportedUserId: null,
    submissionId: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedIncidentType = INCIDENT_TYPES.find(type => type.value === formData.incidentType)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (!formData.incidentType) {
      toast.error('Vui lòng chọn loại yêu cầu hỗ trợ')
      return
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      toast.error('Vui lòng mô tả lý do chi tiết (ít nhất 10 ký tự)')
      return
    }

    if (formData.reason.length > 2000) {
      toast.error('Lý do không được vượt quá 2000 ký tự')
      return
    }

    setIsSubmitting(true)

    try {
      // Chuẩn bị payload theo đúng format backend
      const payload = {
        incidentType: formData.incidentType,
        courseId: courseId || null,
        studyGroupId: studyGroupId || null,
        reportedUserId: formData.reportedUserId || null,
        submissionId: formData.submissionId || null,
        reason: formData.reason.trim(),
        evidenceUrl: formData.evidenceUrl.trim() || null
      }

      const response = await learnService.sendMentorSupportRequest(payload)

      const isUrgent = selectedIncidentType?.isUrgent

      toast.success(
        isUrgent
          ? ' Yêu cầu khẩn cấp đã được gửi! Mentor sẽ hỗ trợ bạn trong thời gian sớm nhất.'
          : ' Yêu cầu hỗ trợ đã được gửi thành công! Mentor sẽ xem xét và phản hồi sớm.',
        { duration: 5000 }
      )

      // Reset form và đóng modal
      setFormData({
        incidentType: '',
        reason: '',
        evidenceUrl: '',
        reportedUserId: null,
        submissionId: null
      })
      onClose()
    } catch (error) {
      console.error('Error sending mentor support request:', error)
      toast.error(error.message || 'Không thể gửi yêu cầu. Vui lòng thử lại!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
  className="
    w-[calc(100%-2rem)]       /* Mobile: chừa lề 1rem mỗi bên cho thoáng */
    md:w-[90%]                /* Tablet: rộng 90% màn hình */
    lg:w-full                 /* Desktop: rộng tối đa */
    lg:max-w-[1000px]         /* Giới hạn tối đa 1000px ở màn hình lớn */
    max-h-[90vh] 
    p-0 overflow-hidden flex flex-col gap-0 border-none bg-white 
    rounded-2xl shadow-2xl
  " 
  showCloseButton={false}
>
        {/* Header */}
        <div className="p-6 border-b border-border-light flex items-center justify-between bg-linear-to-r from-secondary/5 to-primary/5">
          <div>
            <DialogTitle className="text-xl font-bold text-neutral-dark flex items-center gap-2">
              <AlertCircle size={24} className="text-secondary" />
              Yêu cầu hỗ trợ từ Mentor
            </DialogTitle>
            <DialogDescription className="text-sm text-neutral-medium mt-1">
              Mô tả chi tiết vấn đề để Mentor có thể hỗ trợ bạn tốt nhất
            </DialogDescription>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-hover-light rounded-lg transition-colors text-neutral-medium disabled:opacity-50 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Incident Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Loại yêu cầu hỗ trợ <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INCIDENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('incidentType', type.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${formData.incidentType === type.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border-light hover:border-primary/40 hover:bg-hover-light'
                    } ${type.isUrgent ? 'ring-2 ring-secondary/20' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {type.isUrgent && (
                      <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full font-bold">
                        KHẨN CẤP
                      </span>
                    )}
                  </div>
                  <p className={`text-sm font-semibold mt-1 ${formData.incidentType === type.value ? 'text-primary' : 'text-neutral-dark'
                    }`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-neutral-medium mt-1">
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Reported User Selection - hiển thị nếu cần */}
          {selectedIncidentType?.requiresUser && studyGroup && studyGroup.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-neutral-dark mb-2">
                Người liên quan
              </label>
              <select
                value={formData.reportedUserId || ''}
                onChange={(e) => handleChange('reportedUserId', e.target.value ? Number(e.target.value) : null)}
                className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="">-- Chọn thành viên trong nhóm --</option>
                {studyGroup.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name || member.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason Textarea */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Mô tả chi tiết vấn đề <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              placeholder="Vui lòng mô tả chi tiết vấn đề bạn gặp phải để Mentor có thể hỗ trợ tốt nhất..."
              rows={6}
              maxLength={2000}
              className="w-full px-4 py-3 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
              required
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-neutral-medium">
                Tối thiểu 10 ký tự, tối đa 2000 ký tự
              </p>
              <p className={`text-xs font-semibold ${formData.reason.length > 1900 ? 'text-error' : 'text-neutral-medium'
                }`}>
                {formData.reason.length}/2000
              </p>
            </div>
          </div>

          {/* Evidence URL / File Upload using premium InputFile component */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-dark">
              Bằng chứng xác thực {selectedIncidentType?.requiresEvidence && <span className="text-error">*</span>}
              <span className="text-xs text-neutral-medium font-normal ml-2">
                (Hình ảnh, video, tài liệu hoặc đường dẫn URL)
              </span>
            </label>
            <InputFile
              accept="image/*,video/*,application/pdf"
              maxSize={5 * 1024 * 1024} // 5MB limit
              multiple={false}
              autoUpload={true}
              onChange={(data) => {
                handleChange('evidenceUrl', data.url || '');
              }}
              variant="learner"
              split="3-7"
              placeholder="Dán link Drive, ảnh hoặc tải lên tệp minh chứng trực tiếp..."
            />
            {formData.evidenceUrl && (
              <p className="text-xs text-primary truncate mt-1">
                Bằng chứng đã lưu: <a href={formData.evidenceUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-primary/80">{formData.evidenceUrl}</a>
              </p>
            )}
          </div>

          {/* Warning Box for Urgent */}
          {selectedIncidentType?.isUrgent && (
            <div className="bg-secondary/10 border-l-4 border-secondary p-4 rounded-lg">
              <p className="text-sm font-semibold text-secondary flex items-center gap-2">
                <AlertCircle size={16} />
                Yêu cầu khẩn cấp
              </p>
              <p className="text-xs text-neutral-dark mt-1">
                Yêu cầu của bạn sẽ được ưu tiên xử lý. Mentor sẽ nhận được thông báo ngay lập tức và hỗ trợ bạn trong thời gian sớm nhất (trong vòng 48 giờ).
              </p>
            </div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border-light bg-bg-base flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl border border-border-light text-neutral-dark hover:bg-hover-light transition-all font-semibold disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.incidentType || !formData.reason || formData.reason.length < 10}
            className="px-6 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary/90 hover:shadow-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang gửi...
              </>
            ) : (
              'Gửi yêu cầu hỗ trợ'
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MentorSupportRequestModal
