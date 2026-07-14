import { useState, useEffect, useCallback } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

export const useClassDetail = (classId) => {
  const [classDetail, setClassDetail] = useState(null);
  const [pairs, setPairs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Local state for course modules to handle interactive progression (as designed originally)
  const [modules, setModules] = useState([]);

  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isStartingModule, setIsStartingModule] = useState(false);

  const fetchClassDetail = useCallback(async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const detailData = await mentorService.getClassById(classId);
        setClassDetail(detailData);
        if (detailData && detailData.modules) {
          setModules(detailData.modules);
          const activeModule = detailData.modules.find(m => m.status === "ACTIVE")
            || detailData.modules.find(m => m.status !== "COMPLETED")
            || detailData.modules[0];
          if (activeModule) {
            setSelectedModuleId(activeModule.id);
          }
        }

        try {
          const pairsData = await mentorService.getClassPairs(classId);
          setPairs(pairsData || []);
        } catch (pairErr) {
          console.error("Failed to load pairs:", pairErr);
          setPairs([]);
        }
      });
    } catch (err) {
      toast.error(err.message || 'Không thể tải chi tiết lớp học!');
    }
  }, [classId]);

  useEffect(() => {
    if (classId) {
      fetchClassDetail();
    }
  }, [classId, fetchClassDetail]);

  const handleReminderClick = (studyGroupId) => {
    toast.success(`Đã gửi thông báo nhắc nhở học tập tới Nhóm #PAIR-0${studyGroupId}!`);
  };

  const handleStartNextModule = async (nextModuleId, moduleTitle) => {
    setIsStartingModule(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setModules((prev) =>
      prev.map((m) => {
        if (m.status === "ACTIVE") return { ...m, status: "COMPLETED", completionRate: 100 };
        if (m.id === nextModuleId) return { ...m, status: "ACTIVE", completionRate: 5 };
        return m;
      })
    );
    setIsStartingModule(false);
    toast.success(`Đã kích hoạt module "${moduleTitle || nextModuleId}" thành công!`);
  };

  return {
    classDetail,
    pairs,
    modules,
    isLoading,
    selectedModuleId,
    setSelectedModuleId,
    currentIndex,
    setCurrentIndex,
    isStartingModule,
    handleReminderClick,
    handleStartNextModule
  };
};

export default useClassDetail;
