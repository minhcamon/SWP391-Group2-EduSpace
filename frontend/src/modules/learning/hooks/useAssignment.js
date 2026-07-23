import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router"
import { toast } from "sonner"
import learnService from "@/services/learnService"
import { useAuth } from "@/contexts/AuthContext"
import { runWithLoading } from "@/utils/utils"
import { mockClasses } from "@/lib/mockData"
import useStudyGroupWebSocket from "@/modules/learning/hooks/useStudyGroupWebSocket"

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

  // Layout States
  const [progressDashboard, setProgressDashboard] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false)
  const [isGroupListOpen, setIsGroupListOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState("")

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
        setProgressDashboard(dashboard)
        
        const firstModuleWithPartner = dashboard?.modules?.find((m) => m.partner)
        if (firstModuleWithPartner?.partner?.avatarUrl) {
          setPartnerAvatar(firstModuleWithPartner.partner.avatarUrl)
        }

        // Fetch group messages for the active module's study group
        const activeMod = dashboard?.modules?.find(m =>
          m.assignment?.id?.toString() === assignmentId?.toString()
        ) || dashboard?.modules?.[0];
        
        if (activeMod?.studyGroupId) {
          const msgData = await learnService.getGroupMessages(activeMod.studyGroupId, classId);
          const formatted = (msgData || []).map(msg => ({
              id: msg.id,
              sender: msg.senderName,
              avatar: msg.senderAvatar,
              text: msg.content,
              timestamp: new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMe: msg.senderUserId?.toString() === user?.id?.toString()
          }));
          setMessages(formatted);
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

  // WebSocket Chat Event Handlers
  const handleIncomingWebSocketMessage = useCallback((msg) => {
      const formattedMsg = {
          id: msg.id,
          sender: msg.senderName,
          avatar: msg.senderAvatar,
          text: msg.content,
          timestamp: new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: msg.senderUserId?.toString() === user?.id?.toString()
      };
      setMessages(prev => {
          if (prev.some(m => m.id === formattedMsg.id)) return prev;
          return [...prev, formattedMsg];
      });
  }, [user?.id]);

  const activeMod = progressDashboard?.modules?.find(m =>
    m.assignment?.id?.toString() === assignmentId?.toString()
  ) || progressDashboard?.modules?.[0];

  useStudyGroupWebSocket(activeMod?.studyGroupId, handleIncomingWebSocketMessage);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!classId || !activeMod?.studyGroupId) {
        toast.error("Không tìm thấy nhóm học hoạt động để gửi tin nhắn.");
        return;
    }

    try {
        await learnService.sendGroupMessage(
            activeMod.studyGroupId,
            classId,
            inputText,
            "TEXT"
        );
        setInputText("");
    } catch (error) {
        console.error("Gửi tin nhắn thất bại:", error);
        toast.error(error.message || "Không thể gửi tin nhắn.");
    }
  };

  // Resolve Course Title and ID
  const classInfo = mockClasses[classId] || mockClasses["1"];
  const courseTitle = classInfo?.courseTitle || "";
  const courseId = classInfo?.courseId || null;

  // Sidebar Sections
  const sidebarSections = progressDashboard?.modules?.map(modProgress => {
      const isCompletedMod = modProgress.status === "COMPLETED";
      const isInProgressMod = modProgress.status === "IN_PROGRESS";
      let statusText;
      if (isCompletedMod) {
          statusText = `Module ${modProgress.sortOrder} • Đã Hoàn Thành`;
      } else if (isInProgressMod) {
          statusText = `Module ${modProgress.sortOrder} • Đang Học`;
      } else {
          statusText = `Module ${modProgress.sortOrder} • Chưa Bắt Đầu`;
      }

      return {
          id: modProgress.id,
          title: modProgress.title,
          status: modProgress.status,
          statusText,
          lessons: (modProgress.lessons || []).map(lesProgress => {
              const partner = modProgress.partner;
              const isPartnerAtThis = partner && partner.location && partner.location.lessonId?.toString() === lesProgress.id.toString();
              const currentPartners = isPartnerAtThis ? [
                  {
                      name: partner.name,
                      avatar: partner.avatarUrl,
                      initials: partner.name ? partner.name.split(" ").map(n => n[0]).join("").toUpperCase() : "PT",
                      status: "online",
                      bgColor: "bg-sky-100",
                      textColor: "text-primary"
                  }
              ] : [];

              return {
                  id: lesProgress.id,
                  title: lesProgress.title,
                  duration: "15 phút",
                  isCompleted: lesProgress.completed || lesProgress.isCompleted,
                  isLocked: lesProgress.locked || lesProgress.isLocked,
                  isActive: false,
                  currentPartners
              };
          }),
          assignment: modProgress.assignment ? {
              id: modProgress.assignment.id,
              title: modProgress.assignment.title,
              completed: modProgress.assignment.completed || modProgress.assignment.isCompleted,
              locked: modProgress.assignment.locked || modProgress.assignment.isLocked,
              isCompleted: modProgress.assignment.completed || modProgress.assignment.isCompleted,
              isLocked: modProgress.assignment.locked || modProgress.assignment.isLocked,
              status: modProgress.assignment.status,
              isActive: modProgress.assignment.id?.toString() === assignmentId?.toString()
          } : null
      };
  }) || [];

  // Study Group List
  const studyGroup = [];
  if (user) {
      studyGroup.push({
          id: user.id,
          name: user.fullName || user.username,
          avatar: user.avatarUrl,
          initials: (user.fullName || user.username).split(" ").map(n => n[0]).join("").toUpperCase(),
          status: "online",
          email: user.email,
          bgColor: "bg-primary/10",
          textColor: "text-primary",
          isSelf: true
      });
  }
  if (activeMod?.partner) {
      const p = activeMod.partner;
      studyGroup.push({
          id: p.userId || p.id,
          name: p.name,
          avatar: p.avatarUrl,
          initials: p.name ? p.name.split(" ").map(n => n[0]).join("").toUpperCase() : "PT",
          status: "online",
          email: p.email || `${p.name.toLowerCase().replace(/\s+/g, '')}@eduspace.com`,
          goal: p.description || "Chưa đặt mục tiêu",
          bio: p.description || "Bạn đồng hành cùng tiến độ học tập.",
          currentLesson: p.location ? p.location.lessonName : "Chưa vào bài học"
      });
  }

  // Calculate Progress Percent
  let totalLessonsCount = 0;
  let completedLessonsCount = 0;
  if (progressDashboard?.modules) {
      progressDashboard.modules.forEach(mod => {
          totalLessonsCount += mod.totalLessons || 0;
          completedLessonsCount += mod.completedLessons || 0;
      });
  }
  const progressPercent = totalLessonsCount > 0 
      ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
      : 0;

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
    activeModule: activeMod,
    handleReload: fetchAssignmentAndStatus,
  }
}

export default useAssignment
