import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import { runWithLoading } from "@/utils/utils";

const useLearningArea = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();

    // UI States
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("chat");
    const [isSynced, setIsSynced] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Chat, Notes, Materials States
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [sharedNotes, setSharedNotes] = useState("");
    const [materials, setMaterials] = useState([]);

    // New Dynamic Content States
    const [courseTitle, setCourseTitle] = useState("");
    const [studyGroup, setStudyGroup] = useState([]);
    const [lesson, setLesson] = useState(null);
    const [sidebarSections, setSidebarSections] = useState([]);

    // Fetch Details on Mount / courseId Change
    useEffect(() => {
        const fetchLearningDetails = async () => {
            await runWithLoading(setIsLoading, async () => {
                try {
                    const data = await learnService.getLearningAreaDetails(courseId || 1);
                    setCourseTitle(data.courseTitle || "");
                    setStudyGroup(data.studyGroup || []);
                    setLesson(data.lesson || null);
                    setSidebarSections(data.sidebarSections || []);
                    setMessages(data.messages || []);
                    setSharedNotes(data.notes || "");
                    setMaterials(data.materials || []);
                    
                    if (data.lesson) {
                        setIsCompleted(data.lesson.isCompleted || false);
                    }
                } catch (error) {
                    toast.error(error.message || "Không thể tải nội dung bài học.");
                }
            });
        };

        fetchLearningDetails();
    }, [courseId]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMsg = {
            id: messages.length + 1,
            sender: "You",
            text: inputText,
            timestamp: timeString,
            isMe: true
        };

        setMessages([...messages, newMsg]);
        setInputText("");
        toast.success("Tin nhắn đã gửi!");
    };

    const handleMarkCompleted = () => {
        setIsCompleted(true);
        toast.success("Đã hoàn thành bài học này! Tiếp tục sang bài kế tiếp.", {
            description: "Tiến độ của nhóm đã được cập nhật.",
            action: {
                label: "Xem Dashboard",
                onClick: () => navigate("../dashboard")
            }
        });
    };

    const handleExit = () => {
        navigate(-1);
    };

    return {
        isSidebarOpen,
        setIsSidebarOpen,
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
        sidebarSections
    };
};

export default useLearningArea;
