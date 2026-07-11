import { useState, useEffect, useCallback } from "react";
import mentorService from "@/services/mentorService";
import { runWithLoading } from "@/utils/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useMentorDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [arbitrations, setArbitrations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      await runWithLoading(setIsLoading, async () => {
        const [classesData, incidentsData, arbitrationsData] = await Promise.all([
          mentorService.getMentorClasses(),
          mentorService.getIncidents(),
          mentorService.getArbitrations()
        ]);
        setClasses(classesData || []);
        setIncidents(incidentsData || []);
        setArbitrations(arbitrationsData || []);
      });
    } catch (error) {
      console.error("Lỗi khi tải thông tin dashboard:", error);
      toast.error("Không thể tải thông tin tổng quan!");
    }
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Compute metrics
  const assignedClassesCount = classes.length;
  let healthyPairs = 0;
  let slowPairs = 0;
  let brokenPairs = 0;

  classes.forEach((c) => {
    if (c.studyGroups && Array.isArray(c.studyGroups)) {
      c.studyGroups.forEach((sg) => {
        if (sg.status === "SLOW") slowPairs++;
        else if (sg.status === "BROKEN") brokenPairs++;
        else healthyPairs++;
      });
    }
  });

  const pendingIncidentsCount = incidents.filter((i) => i.status === "PENDING").length;
  const pendingArbitrationsCount = arbitrations.filter((a) => a.status === "PENDING").length;

  const rescueQueue = incidents
    .filter((i) => i.status !== "RESOLVED")
    .slice(0, 3);

  return {
    classes,
    incidents,
    arbitrations,
    isLoading,
    assignedClassesCount,
    healthyPairs,
    slowPairs,
    brokenPairs,
    pendingIncidentsCount,
    pendingArbitrationsCount,
    rescueQueue,
    refreshDashboard: fetchDashboardData
  };
};

export default useMentorDashboard;
