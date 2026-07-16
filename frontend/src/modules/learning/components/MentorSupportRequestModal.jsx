import { X, AlertCircle, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import learnService from '@/services/learnService'

// Danh sách các loại incident từ backend enum
const INCIDENT_TYPES = [
  {
    value: 'PEER_REVIEW_DISPUTE',
    label: 'Khiếu nại điểm chấm chéo',
    description: 'Điểm do bạn học chấm có vấn đề hoặc nhầm lẫn',
    requiresSubmission: true
  },
  {
    value: 'GRADE_OVERRIDE_REQUEST',
    label: 'Yêu cầu Mentor chấm lại',
    description: 'Yêu cầu Mentor nhảy vào chấm lại bài hoặc ghi đè điểm',
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border-light flex items-center justify-between bg-gradient-to-r from-secondary/5 to-primary/5">
          <div>
            <h2 className="text-xl font-bold text-neutral-dark flex items-center gap-2">
              <AlertCircle size={24} className="text-secondary" />
              Yêu cầu hỗ trợ từ Mentor
            </h2>
            <p className="text-sm text-neutral-medium mt-1">
              Mô tả chi tiết vấn đề để Mentor có thể hỗ trợ bạn tốt nhất
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-hover-light rounded-lg transition-colors text-neutral-medium disabled:opacity-50"
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

          {/* Evidence URL */}
          <div>
            <label className="block text-sm font-semibold text-neutral-dark mb-2">
              Link bằng chứng {selectedIncidentType?.requiresEvidence && <span className="text-error">*</span>}
              <span className="text-xs text-neutral-medium font-normal ml-2">
                (screenshot, video, link,...)
              </span>
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.evidenceUrl}
                onChange={(e) => handleChange('evidenceUrl', e.target.value)}
                placeholder="https://example.com/evidence.png"
                maxLength={2000}
                className="w-full px-4 py-3 pl-10 border border-border-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <Upload size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-medium" />
            </div>
            <p className="text-xs text-neutral-medium mt-1">
              Có thể upload ảnh/video lên Google Drive, Imgur, YouTube và dán link vào đây
            </p>
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
        <div className="p-6 border-t border-border-light bg-bg-base flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl border border-border-light text-neutral-dark hover:bg-hover-light transition-all font-semibold disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.incidentType || !formData.reason || formData.reason.length < 10}
            className="px-6 py-2.5 rounded-xl bg-secondary text-white hover:bg-secondary/90 hover:shadow-md transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
      </div>
    </div>
  )
}

export default MentorSupportRequestModal
