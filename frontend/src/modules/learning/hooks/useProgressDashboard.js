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
    const [modules, setModules] = useState([]);

    // Fetch Details on Mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            await runWithLoading(setIsLoading, async () => {
                try {
                    const data = await learnService.getProgressDashboard(courseId || 1);
                    setPartner(data.partner);
                    setModules(data.modules || []);
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

    // Tìm Module đang học (IN_PROGRESS), nếu không tìm thấy thì lấy Module đầu tiên chưa hoàn thành
    const currentModule = modules.find((m) => m.status === "IN_PROGRESS") || modules[0];

    return {
        isLoading,
        partner,
        modules,
        currentModule,
        handleSayHi,
        courseId
    };
};

export default useProgressDashboard;
