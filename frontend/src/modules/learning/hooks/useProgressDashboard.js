import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import learnService from "@/services/learnService";
import { runWithLoading } from "@/utils/utils";

const useProgressDashboard = () => {
    const { courseId } = useParams();

    // UI States
    const [isLoading, setIsLoading] = useState(true);
    const [partner, setPartner] = useState(null);
    const [progress, setProgress] = useState(null);
    const [roadmap, setRoadmap] = useState([]);

    // Fetch Details on Mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            await runWithLoading(setIsLoading, async () => {
                try {
                    const data = await learnService.getProgressDashboard(courseId || 1);
                    setPartner(data.partner);
                    setProgress(data.progress);
                    setRoadmap(data.roadmap || []);
                } catch (error) {
                    toast.error(error.message || "Không thể tải thông tin tiến độ nhóm.");
                }
            });
        };

        fetchDashboardData();
    }, [courseId]);

    const handleSayHi = () => {
        toast.success(`Đã gửi lời chào đến ${partner?.name || "bạn đồng hành"}!`, {
            description: `${partner?.name || "Bạn đồng hành"} sẽ nhận được thông báo chào hỏi của bạn.`
        });
    };

    return {
        isLoading,
        partner,
        progress,
        roadmap,
        handleSayHi,
        courseId
    };
};

export default useProgressDashboard;
