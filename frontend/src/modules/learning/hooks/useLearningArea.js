import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import courseService from "@/services/courseService";
import { useAuth } from "@/contexts/AuthContext";
import { runWithLoading } from "@/utils/utils";

const useLearningArea = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const { user } = useAuth();

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [isGroupListOpen, setIsGroupListOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [activeTab, setActiveTab] = useState("notes");
    const [isSynced, setIsSynced] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Local completion status mapping (lessonId -> true) to avoid sync-state in effects warning
    const [completedLessonsLocal, setCompletedLessonsLocal] = useState({});

    // Resolved class ID
    const [resolvedClassId, setResolvedClassId] = useState(null);

    // Fetch static details & progress dashboard
    const [courseDetails, setCourseDetails] = useState(null);
    const [progressDashboard, setProgressDashboard] = useState(null);

    // Active lesson and module selection state
    const [activeLessonId, setActiveLessonId] = useState(null);
    const [activeModuleId, setActiveModuleId] = useState(null);

    // Chat, Notes, Materials States
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [sharedNotes, setSharedNotes] = useState("");
    const [materials] = useState([]); // Empty since backend doesn't support yet

    // Fetch initial details
    useEffect(() => {
        const fetchInitialDetails = async () => {
            if (!courseId) return;

            await runWithLoading(setIsLoading, async () => {
                try {
                    // 1. Get user's learning courses to resolve classId
                    const inProgressCourses = await learnService.getMyLearningCourses();
                    const currentCourse = inProgressCourses.find(
                        (c) => c.courseId.toString() === courseId.toString()
                    );
                    
                    if (!currentCourse) {
                        throw new Error("Bạn chưa tham gia lớp học nào cho khóa học này.");
                    }
                    
                    const classId = currentCourse.classId;
                    setResolvedClassId(classId);

                    // 2. Fetch course structure details
                    const details = await courseService.getCourseById(courseId);
                    setCourseDetails(details);

                    // 3. Fetch progress dashboard details
                    const dashboard = await learnService.getProgressDashboard(classId);
                    setProgressDashboard(dashboard);

                    // 4. Determine initial active lesson and module
                    if (dashboard.focusLessonId) {
                        setActiveLessonId(dashboard.focusLessonId);
                        // Find module containing the focused lesson
                        const matchedMod = dashboard.modules?.find(m => 
                            m.lessons?.some(l => l.id.toString() === dashboard.focusLessonId.toString())
                        );
                        if (matchedMod) {
                            setActiveModuleId(matchedMod.id);
                        } else {
                            setActiveModuleId(dashboard.focusModuleId);
                        }
                    } else if (dashboard.focusModuleId) {
                        setActiveModuleId(dashboard.focusModuleId);
                        const matchedMod = dashboard.modules?.find(m => m.id === dashboard.focusModuleId);
                        if (matchedMod && matchedMod.lessons && matchedMod.lessons.length > 0) {
                            setActiveLessonId(matchedMod.lessons[0].id);
                        }
                    } else if (dashboard.modules && dashboard.modules.length > 0) {
                        setActiveModuleId(dashboard.modules[0].id);
                        if (dashboard.modules[0].lessons && dashboard.modules[0].lessons.length > 0) {
                            setActiveLessonId(dashboard.modules[0].lessons[0].id);
                        }
                    }
                } catch (error) {
                    console.error("Failed to load learning area details:", error);
                    toast.error(error.message || "Không thể tải nội dung học tập.");
                }
            });
        };

        fetchInitialDetails();
    }, [courseId]);

    // Handle selecting a lesson from the sidebar
    const handleSelectLesson = async (lessonId, moduleId) => {
        setActiveLessonId(lessonId);
        
        // If changing module, fetch its progress data from backend
        if (moduleId !== activeModuleId && resolvedClassId) {
            setActiveModuleId(moduleId);
            try {
                const subDashboard = await learnService.getProgressSidebarLearningSpace(resolvedClassId, moduleId);
                setProgressDashboard(prev => {
                    if (!prev) return subDashboard;
                    // Merge or update the module list
                    const updatedModules = prev.modules.map(mod => 
                        mod.id === moduleId ? subDashboard.modules.find(m => m.id === moduleId) || mod : mod
                    );
                    return {
                        ...prev,
                        modules: updatedModules,
                        focusModuleId: moduleId,
                        focusLessonId: lessonId
                    };
                });
            } catch (error) {
                console.error("Failed to load module specific details:", error);
            }
        }
    };

    // Find a static lesson structure by ID
    const findStaticLesson = (lesId) => {
        if (!courseDetails || !courseDetails.modules || !lesId) return null;
        for (const mod of courseDetails.modules) {
            if (mod.lessons) {
                const found = mod.lessons.find(l => l.id.toString() === lesId.toString());
                if (found) return found;
            }
        }
        return null;
    };

    // Computed properties
    const activeModule = progressDashboard?.modules?.find(m => m.id === activeModuleId);
    
    // Fetch Messages when active group or class changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!resolvedClassId || !activeModule?.studyGroupId) {
                setMessages([]);
                return;
            }
            try {
                const data = await learnService.getGroupMessages(activeModule.studyGroupId, resolvedClassId);
                const formatted = (data || []).map(msg => ({
                    id: msg.id,
                    sender: msg.senderName,
                    avatar: msg.senderAvatar,
                    text: msg.content,
                    timestamp: new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: msg.senderUserId?.toString() === user?.id?.toString()
                }));
                setMessages(formatted);
            } catch (error) {
                console.error("Failed to fetch group messages:", error);
            }
        };

        fetchMessages();
    }, [resolvedClassId, activeModule?.studyGroupId, user?.id]);

    // Construct mapped sidebar sections for CourseSidebar
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
                const isThisLessonActive = activeLessonId && activeLessonId.toString() === lesProgress.id.toString();
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
                    isCompleted: completedLessonsLocal[lesProgress.id] || lesProgress.completed || lesProgress.isCompleted,
                    isLocked: lesProgress.locked || lesProgress.isLocked,
                    isActive: isThisLessonActive,
                    currentPartners
                };
            }),
            assignment: modProgress.assignment ? {
                id: modProgress.assignment.id,
                title: modProgress.assignment.title,
                isCompleted: modProgress.assignment.isCompleted,
                isLocked: modProgress.assignment.isLocked,
                status: modProgress.assignment.status,
            } : null
        };
    }) || [];

    // Construct active lesson details
    const activeLessonProgress = activeModule?.lessons?.find(l => l.id.toString() === activeLessonId?.toString());
    const activeStaticLesson = findStaticLesson(activeLessonId);

    const isCompleted = activeLessonId ? (!!completedLessonsLocal[activeLessonId] || !!activeLessonProgress?.completed || !!activeLessonProgress?.isCompleted) : false;
    
    const lesson = activeStaticLesson ? {
        id: activeStaticLesson.id,
        module: activeModule?.title || "Module",
        title: activeStaticLesson.title,
        duration: "15 phút",
        description: `Nội dung chi tiết của bài học ${activeStaticLesson.title}.`,
        videoUrl: activeStaticLesson.contentUrl,
        videoDuration: "15:00",
        videoProgressPercent: isCompleted ? 100 : 0,
        videoCurrentTime: isCompleted ? "15:00" : "00:00",
        isCompleted: isCompleted,
        partnerName: activeModule?.partner?.name || "Bạn đồng hành"
    } : null;

    // Construct studyGroup members
    const studyGroup = [];
    if (user) {
        studyGroup.push({
            id: user.id,
            name: user.fullName || user.username,
            avatar: user.avatarUrl,
            initials: (user.fullName || user.username).split(" ").map(n => n[0]).join("").toUpperCase(),
            status: "online",
            email: user.email,
            goal: "Bản thân",
            bio: "Tôi là người học",
            currentLesson: activeStaticLesson ? activeStaticLesson.title : ""
        });
    }
    if (activeModule?.partner) {
        const p = activeModule.partner;
        studyGroup.push({
            id: p.partnerId,
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

    // Handlers
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        if (!resolvedClassId || !activeModule?.studyGroupId) {
            toast.error("Không tìm thấy nhóm học hoạt động để gửi tin nhắn.");
            return;
        }

        try {
            await learnService.sendGroupMessage(
                activeModule.studyGroupId,
                resolvedClassId,
                inputText,
                "TEXT"
            );
            setInputText("");
            
            const data = await learnService.getGroupMessages(activeModule.studyGroupId, resolvedClassId);
            const formatted = (data || []).map(msg => ({
                id: msg.id,
                sender: msg.senderName,
                avatar: msg.senderAvatar,
                text: msg.content,
                timestamp: new Date(msg.sendAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: msg.senderUserId?.toString() === user?.id?.toString()
            }));
            setMessages(formatted);
        } catch (error) {
            console.error("Gửi tin nhắn thất bại:", error);
            toast.error(error.message || "Không thể gửi tin nhắn.");
        }
    };

    const handleMarkCompleted = async () => {
        if (!activeLessonId || !resolvedClassId) {
            toast.error("Không tìm thấy thông tin bài học hoặc lớp học.");
            return;
        }

        try {
            await learnService.completeLesson(activeLessonId, resolvedClassId);
            setCompletedLessonsLocal(prev => ({ ...prev, [activeLessonId]: true }));
            
            // Refresh progress dashboard data from backend
            const updatedDashboard = await learnService.getProgressDashboard(resolvedClassId);
            setProgressDashboard(updatedDashboard);

            // Automatically switch to the next focus lesson if available
            let nextLessonId = updatedDashboard.focusLessonId;
            
            // Fallback: If backend didn't return focusLessonId, find the next lesson in sequence manually
            if (!nextLessonId) {
                const allLessons = updatedDashboard.modules
                    ? updatedDashboard.modules.reduce((acc, m) => {
                        if (m.lessons) {
                            m.lessons.forEach(l => {
                                acc.push({ ...l, moduleId: m.id });
                            });
                        }
                        return acc;
                    }, [])
                    : [];
                const currentIndex = allLessons.findIndex(l => l.id.toString() === activeLessonId.toString());
                if (currentIndex !== -1 && currentIndex + 1 < allLessons.length) {
                    const nextLesson = allLessons[currentIndex + 1];
                    if (!nextLesson.isLocked && !nextLesson.locked) {
                        nextLessonId = nextLesson.id;
                    }
                }
            }

            if (nextLessonId && nextLessonId.toString() !== activeLessonId.toString()) {
                setActiveLessonId(nextLessonId);
                
                // Find and update active module if the next lesson belongs to a different module
                const matchedMod = updatedDashboard.modules?.find(m => 
                    m.lessons?.some(l => l.id.toString() === nextLessonId.toString())
                );
                if (matchedMod) {
                    setActiveModuleId(matchedMod.id);
                } else if (updatedDashboard.focusModuleId) {
                    setActiveModuleId(updatedDashboard.focusModuleId);
                }
            }

            toast.success("Đã hoàn thành bài học này! Tiếp tục sang bài kế tiếp.", {
                description: "Tiến độ của nhóm đã được cập nhật.",
                action: {
                    label: "Xem Dashboard",
                    onClick: () => navigate("../dashboard")
                }
            });
        } catch (error) {
            console.error("Đánh dấu hoàn thành bài học thất bại:", error);
            toast.error(error.message || "Không thể hoàn thành bài học.");
        }
    };


    const handleExit = () => {
        navigate(-1);
    };

    // Calculate total progress
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
        courseTitle: courseDetails?.title || "",
        studyGroup,
        lesson,
        sidebarSections,
        handleSelectLesson,
        progressPercent,
        resolvedClassId
    };
};

export default useLearningArea;
