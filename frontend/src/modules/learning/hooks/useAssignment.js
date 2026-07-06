import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import { assignmentMockData } from "../utils/assignmentMockData";
import { runWithLoading } from "@/utils/utils";

const useAssignment = () => {
    const { classId, assignmentId } = useParams();
    const [activeTab, setActiveTab] = useState("assignment");
    const [isLoading, setIsLoading] = useState(true);

    const [assignmentDetails, setAssignmentDetails] = useState(null);
    const [essay, setEssay] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [partner, setPartner] = useState(assignmentMockData.partner);
    const [comments, setComments] = useState(assignmentMockData.submission.comments);
    const [newCommentText, setNewCommentText] = useState("");
    const [newCommentCategory, setNewCommentCategory] = useState("Lexical Resource");
    const [timeRemaining, setTimeRemaining] = useState(assignmentMockData.timeRemaining);

    useEffect(() => {
        const fetchDetails = async () => {
            await runWithLoading(setIsLoading, async () => {
                try {
                    const details = await learnService.getAssignmentDetails(assignmentId);
                    setAssignmentDetails(details);
                } catch (error) {
                    console.error("Failed to fetch assignment details:", error);
                    toast.error("Không thể tải thông tin bài tập.");
                }
            });
        };
        fetchDetails();
    }, [assignmentId]);

    // Simple countdown timer simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeRemaining(prev => (prev > 1 ? prev - 1 : 45));
        }, 60000); // decrement every minute
        return () => clearInterval(timer);
    }, []);

    const wordCount = essay.trim() === "" ? 0 : essay.trim().split(/\s+/).length;

    const handleEssayChange = (e) => {
        if (!isSubmitted) {
            setEssay(e.target.value);
        }
    };

    const handleSubmitDraft = async () => {
        if (wordCount < 5) {
            toast.warning("Bài viết quá ngắn. Vui lòng viết thêm trước khi nộp!");
            return;
        }
        await runWithLoading(setIsSubmitting, async () => {
            try {
                const response = await learnService.submitAssignmentDraft(assignmentId, essay);
                setIsSubmitted(true);
                toast.success(response.message || "Nộp bài nháp thành công!");

                // Simulate partner completing their progress
                setPartner(prev => ({
                    ...prev,
                    progress: 100,
                    statusText: "Bạn học đã hoàn thành 100%",
                    detail: "Nguyen Van A đã hoàn thành bài viết của mình và sẵn sàng đối chiếu."
                }));
            } catch (error) {
                toast.error(error.message || "Có lỗi xảy ra khi nộp bài.");
            }
        });
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newCommentText.trim()) return;

        const newCommentPayload = {
            type: newCommentCategory,
            text: newCommentText,
            category: newCommentCategory.toLowerCase().includes("grammar") ? "grammar" : "lexical"
        };

        try {
            const response = await learnService.addPeerFeedback(assignmentId, newCommentPayload);
            if (response.isSuccess) {
                setComments(prev => [...prev, response.data]);
                setNewCommentText("");
                toast.success("Đã thêm nhận xét góp ý!");
            }
        } catch (error) {
            toast.error(error.message || "Không thể thêm nhận xét.");
        }
    };

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
        partner,
        comments,
        newCommentText,
        setNewCommentText,
        newCommentCategory,
        setNewCommentCategory,
        timeRemaining,
        handleEssayChange,
        handleSubmitDraft,
        handleAddComment,
        rubricCriteria: assignmentMockData.submission.rubricCriteria,
        estimatedBand: assignmentMockData.submission.estimatedBand,
        partnerSubmission: assignmentMockData.submission
    };
};

export default useAssignment;
