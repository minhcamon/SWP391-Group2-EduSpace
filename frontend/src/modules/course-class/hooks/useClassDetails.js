import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { mockClasses } from "@/lib/mockData";
import classService from "@/services/classService";

export const useClassDetails = (classId) => {
  const [searchParams] = useSearchParams();
  const [classData, setClassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        setIsLoading(true);
        const rawClass = mockClasses[classId] || mockClasses["1"];
        if (rawClass) {
          const urlStatus = searchParams.get("status");
          const finalStatus = urlStatus ? urlStatus.toUpperCase() : rawClass.status;
          const updatedClassData = {
            ...rawClass,
            status: finalStatus,
          };

          try {
            const communityResponse = await classService.getCommunity(classId);
            const communityData = communityResponse?.data;
            if (communityData) {
              const mappedPersonnel = communityData.map((group, idx) => {
                const members = (group.members || []).map(member => ({
                  id: member.userId,
                  name: member.fullName || member.username || "Học viên",
                  avatar: member.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"
                }));

                return {
                  id: group.studyGroupId || idx,
                  pairName: `Nhóm ${String(idx + 1).padStart(2, '0')}`,
                  status: group.status === "ACTIVE" || group.status === "OPENING" ? "ACTIVE" : "IN BREAK",
                  members
                };
              });
              updatedClassData.activePersonnel = mappedPersonnel;
            }
          } catch (communityErr) {
            console.warn("Failed to fetch community groups for class details:", communityErr);
          }

          setClassData(updatedClassData);
        } else {
          setError("Không tìm thấy thông tin lớp học.");
        }
      } catch (err) {
        setError(err.message || "Không thể tải thông tin lớp học.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId, searchParams]);

  const addReaction = (feedId, emoji) => {
    setClassData((prev) => {
      if (!prev) return prev;
      const updatedFeed = prev.activeFeed.map((item) => {
        if (item.id === feedId) {
          const updatedReactions = item.reactions.map((r) => {
            if (r.emoji === emoji) {
              return {
                ...r,
                count: r.userReacted ? r.count - 1 : r.count + 1,
                userReacted: !r.userReacted,
              };
            }
            return r;
          });
          return { ...item, reactions: updatedReactions };
        }
        return item;
      });
      return { ...prev, activeFeed: updatedFeed };
    });
  };

  return {
    classData,
    isLoading,
    error,
    addReaction,
  };
};

export default useClassDetails;
