import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"
import learnService from "@/services/learnService"
import { useAuth } from "@/contexts/AuthContext"
import { runWithLoading } from "@/utils/utils"

const useAssignment = () => {
  const { classId, assignmentId } = useParams()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("assignment")
  const [isLoading, setIsLoading] = useState(true)

  const [assignmentDetails, setAssignmentDetails] = useState(null)
  const [essay, setEssay] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isGraded, setIsGraded] = useState(false)
  const [peerReviewPending, setPeerReviewPending] = useState(false)

  const [myReviewResult, setMyReviewResult] = useState(null)

  const [peerReviewTask, setPeerReviewTask] = useState(null)
  const [peerReviewGraded, setPeerReviewGraded] = useState(false)
  const [partnerAvatar, setPartnerAvatar] = useState("")

  // Cache classMemberId in localStorage after first successful submit
  const classMemberIdKey = classId ? `classMemberId_${classId}` : null
  const getCachedClassMemberId = () => {
    if (!classMemberIdKey) return null
    const cached = localStorage.getItem(classMemberIdKey)
    return cached ? Number(cached) : null
  }

  const fetchAssignmentAndStatus = useCallback(async () => {
    if (!user) return
    try {
      let details = null

      try {
        const review = await learnService.getSubmissionReview(classId, assignmentId)
        setIsSubmitted(true)

        if (review.submissionContent) {
          setEssay(review.submissionContent)
        }

        const hasBeenGraded =
          review.rubricCriterias &&
          review.rubricCriterias.length > 0 &&
          review.rubricCriterias.every((c) => c.score !== null)

        setIsGraded(hasBeenGraded)
        setMyReviewResult(review)
        setPeerReviewPending(!hasBeenGraded)

        if (review.assignmentTitle) {
          details = {
            id: Number(assignmentId),
            title: review.assignmentTitle,
            description: review.assignmentDescription,
          }
        }
      } catch (err) {
        const errMsg = err.message || ""
        if (errMsg.includes("Peer Review không tồn tại") || errMsg.toLowerCase().includes("peer review not found")) {
          setIsSubmitted(true)
          setIsGraded(false)
          setPeerReviewPending(true)
        } else if (errMsg.includes("Submission không tồn tại") || errMsg.toLowerCase().includes("submission not found")) {
          setIsSubmitted(false)
          setIsGraded(false)
          setPeerReviewPending(false)
          setEssay("")
        } else {
          console.error("Lỗi getSubmissionReview:", err)
        }
      }

      try {
        const peerTask = await learnService.getPeerReviewAssignment(classId, assignmentId)
        setPeerReviewTask(peerTask)

        if (peerTask.assignmentTitle && !details) {
          details = {
            id: Number(assignmentId),
            title: peerTask.assignmentTitle,
            description: peerTask.assignmentDescription,
          }
        }

        const gradedFromData =
          peerTask.rubricCriterias &&
          peerTask.rubricCriterias.length > 0 &&
          peerTask.rubricCriterias.some((c) => c.score !== null && c.score !== undefined)
        setPeerReviewGraded(gradedFromData)
      } catch {
        setPeerReviewTask(null)
        setPeerReviewGraded(false)
      }

      if (!details) {
        details = await learnService.getAssignmentDetails(classId, assignmentId)
      }
      setAssignmentDetails(details)

      try {
        const dashboard = await learnService.getProgressDashboard(classId)
        const firstModuleWithPartner = dashboard?.modules?.find((m) => m.partner)
        if (firstModuleWithPartner?.partner?.avatarUrl) {
          setPartnerAvatar(firstModuleWithPartner.partner.avatarUrl)
        }
      } catch {
        // Ignore dashboard fetch issues
      }
    } catch (error) {
      console.error("Lỗi fetchAssignmentAndStatus:", error)
      toast.error("Không thể tải thông tin bài tập.")
    }
  }, [classId, assignmentId, user])

  useEffect(() => {
    runWithLoading(setIsLoading, fetchAssignmentAndStatus)
  }, [fetchAssignmentAndStatus])

  const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length

  const handleEssayChange = (e) => {
    if (!isSubmitted) {
      setEssay(e.target.value)
    }
  }

  const handleSubmitDraft = async () => {
    if (wordCount < 5) {
      toast.warning("Bài viết quá ngắn. Vui lòng viết thêm trước khi nộp!")
      return
    }

    // Prefer cached classMemberId; fall back to user.id-3 for test environments
    const learnerId = getCachedClassMemberId() ?? (user ? user.id - 3 : null)
    if (!learnerId || learnerId <= 0) {
      toast.error("Không thể xác định mã học viên. Vui lòng thử lại sau!")
      return
    }

    await runWithLoading(setIsSubmitting, async () => {
      try {
        const result = await learnService.submitAssignment(learnerId, assignmentId, essay)
        // Cache the actual classMemberId returned by backend for future use
        if (result?.data?.memberId && classMemberIdKey) {
          localStorage.setItem(classMemberIdKey, String(result.data.memberId))
        }
        setIsSubmitted(true)
        setPeerReviewPending(true)
        toast.success("Nộp bài viết thành công!")

        await fetchAssignmentAndStatus()
      } catch (error) {
        toast.error(error.message || "Có lỗi xảy ra khi nộp bài.")
      }
    })
  }

  const submitPeerReview = async (criteriaScores, finalScore, comments) => {
    if (!peerReviewTask?.reviewId) {
      toast.error("Không tìm thấy mã số đánh giá chéo!")
      return
    }

    try {
      await learnService.gradePeerReview(
        classId,
        peerReviewTask.reviewId,
        criteriaScores,
        finalScore,
        comments,
      )
      setPeerReviewGraded(true)
      toast.success("Gửi điểm đánh giá chéo thành công!")
      await fetchAssignmentAndStatus()
    } catch (error) {
      toast.error(error.message || "Không thể gửi đánh giá.")
    }
  }

  return {
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
  }
}

export default useAssignment
