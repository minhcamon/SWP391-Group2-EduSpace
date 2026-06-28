import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useClassDetails } from "../hooks/useClassDetails";
import ClassFeed from "../components/ClassFeed";
import ClassPersonnel from "../components/ClassPersonnel";
import ClassLeaderboard from "../components/ClassLeaderboard";
import ClassLeaderboardSidebar from "../components/ClassLeaderboardSidebar";
import MentorPairsMonitor from "../components/MentorPairsMonitor";
import MentorEvaluation from "../components/MentorEvaluation";
import MentorBroadcast from "../components/MentorBroadcast";
import MentorClassChat from "../components/MentorClassChat";
import {
  Users,
  TrendingUp,
  Plus
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const ClassPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    classData,
    isLoading,
    error,
    addReaction,
    findStudyBuddy,
  } = useClassDetails(classId);

  const searchParams = new URLSearchParams(window.location.search);
  const statusParam = searchParams.get("status");

  const isCreator = user?.role === "CREATOR";
  const isInStudyGroup = classData?.activePersonnel?.some((group) =>
    group.members?.some((member) => member.id?.toString() === user?.id?.toString())
  );
  const [learnerTab, setLearnerTab] = useState("feed");
  const [creatorTab, setCreatorTab] = useState("pairs");

  const [leaderboardMode, setLeaderboardMode] = useState("individual");

  const [announcementText, setAnnouncementText] = useState("");

  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    if (!isLoading && classData) {
      console.log("classData: ", classData)
    }
  }, [isLoading, classData, statusParam, navigate]);

  if (isLoading) {
    return (
      <div className="grow flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-neutral-medium">
            Đang tải thông tin lớp học...
          </span>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    console.log("error: ", error)
    console.log("classData: ", classData)
    return (
      <div className="grow flex items-center justify-center min-h-[500px] px-4">
        <div className="text-center p-8 bg-white rounded-2xl border border-border-light/40 shadow-sm max-w-md">
          <h2 className="text-xl font-bold text-danger mb-2">Đã xảy ra lỗi</h2>
          <p className="text-sm text-neutral-medium mb-6">
            {error || "Không thể tìm thấy thông tin lớp học."}
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/95 transition-colors"
          >
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  const handleSendAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;
    toast.success("Đã gửi thông báo thành công đến 10 học viên!");
    setAnnouncementText("");
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: chatMessages.length + 1,
      sender: "Mentor",
      content: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
      isSelf: true,
    };

    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "Minh Quân",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100",
          content: "Dạ vâng ạ, tụi em sẽ nộp bài đúng hạn tối nay!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSystem: false,
          isSelf: false,
        }
      ]);
    }, 1500);
  };

  // Learner Mock Data for Leaderboard
  const mockIndividualLeaderboard = [
    { rank: 1, name: "Minh Anh Nguyễn", target: "Target: 8.5 IELTS", progress: 98, points: "2,480", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100", isPremium: true },
    { rank: 2, name: "Lê Quang Minh", target: "Target: 8.0 IELTS", progress: 92, points: "2,150", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100", isSelf: true },
    { rank: 3, name: "Hoàng Gia Bảo", target: "Target: 7.5 IELTS", progress: 85, points: "1,980", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" },
    { rank: 4, name: "Trần Thu Hà", target: "Target: 7.0 IELTS", progress: 78, points: "1,820", initials: "TH" },
    { rank: 5, name: "Đặng Văn Phương", target: "Target: 6.5 IELTS", progress: 72, points: "1,750", initials: "DP" }
  ];

  const mockPairLeaderboard = [
    { rank: 1, name: "Minh Anh & Bảo", detail: "Trung bình hoàn thành: 91.5%", progress: 91, points: "4,460", avatars: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100"] },
    { rank: 2, name: "Quang Minh & Thúy Hạnh", detail: "Cặp của bạn", progress: 85, points: "3,970", avatars: ["https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100"], isSelf: true },
    { rank: 3, name: "Hoàng Nam & Lan Anh", detail: "Trung bình hoàn thành: 78.0%", progress: 78, points: "3,520", avatars: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100", "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100"] }
  ];

  const mockPairsMonitor = [
    { id: 1, name: "Minh Quân & Thùy Chi", lesson: "Lesson 14: Writing Task 2", progress: 65, status: "ACTIVE", avatar1: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100", avatar2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100" },
    { id: 2, name: "Hoàng Nam & Lan Anh", lesson: "Lesson 18: Advanced Grammar", progress: 82, status: "ACTIVE", avatar1: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100", avatar2: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100" },
    { id: 3, name: "Quốc Bảo & Mỹ Linh", lesson: "Lesson 05: Reading Flow", progress: 30, status: "ACTIVE", avatar1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100", avatar2: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100" },
    { id: 4, name: "Gia Huy & Phương Vy", lesson: "Ngoại tuyến (1h trước)", progress: 45, status: "OFFLINE", avatar1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100", avatar2: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=100" },
    { id: 5, name: "Đăng Khoa & Thu Trang", lesson: "Cần hỗ trợ Lesson 02", progress: 15, status: "NEED_SUPPORT", avatar1: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=100", avatar2: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100" }
  ];

  return (
    <main className="grow flex flex-col w-full">
      {/* Main Section */}
      <div className="max-w-[1280px] mx-auto w-full px-4 md:px-8 py-8 grow">
        <Breadcrumbs items={[
          { label: "Khóa học", to: "/courses" },
          { label: classData.courseTitle || "Chi tiết", to: `/courses/${classData.courseId}` },
          { label: classData.cohortName || "Lớp học" }
        ]}
          className="mb-4"
        />

        {/* Dashboard Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-light/25 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
                Cohort #{classData.classId || "104"}
              </span>
              <span className="text-xs text-neutral-light font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> 10 Học viên hoạt động
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
              {isCreator ? "Bảng điều khiển Giảng viên" : "Bảng tin Lớp học"}
            </h1>
            <p className="text-sm text-neutral-medium mt-1">
              {isCreator
                ? "Theo dõi tiến độ ghép cặp, xem kết quả làm bài tập và quản lý các hoạt động lớp."
                : "Cập nhật các hoạt động mới nhất và theo dõi bảng xếp hạng của lớp."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCreator && isInStudyGroup && (
              <button
                onClick={() => navigate(`/courses/${classData.courseId}/dashboard`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/95 text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Xem tiến trình học tập
              </button>
            )}
            <Badge variant="roletag" className="py-1.5 px-4 rounded-full text-xs font-bold">
              Lớp hoạt động
            </Badge>
          </div>
        </div>

        {/* MENTOR VIEW */}
        {isCreator ? (
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Left Management Column (70%) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tabs Switcher */}
              <div className="flex border-b border-border-light/30">
                <button
                  onClick={() => setCreatorTab("pairs")}
                  className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all ${creatorTab === "pairs"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-neutral-medium hover:text-primary"
                    }`}
                >
                  Theo dõi Cặp đôi
                </button>
                <button
                  onClick={() => setCreatorTab("evaluation")}
                  className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all flex items-center gap-2 ${creatorTab === "evaluation"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-neutral-medium hover:text-primary"
                    }`}
                >
                  Duyệt bài tập
                  <span className="px-1.5 py-0.5 bg-secondary text-white text-[10px] rounded-full font-bold">
                    2
                  </span>
                </button>
              </div>

              {/* Pairs Tab content */}
              {creatorTab === "pairs" && (
                <MentorPairsMonitor pairs={mockPairsMonitor} />
              )}

              {/* Evaluation Tab content */}
              {creatorTab === "evaluation" && (
                <MentorEvaluation />
              )}
            </div>

            {/* Right Sidebar Widgets Column (30%) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Broadcast announcements */}
              <MentorBroadcast
                announcementText={announcementText}
                setAnnouncementText={setAnnouncementText}
                onBroadcast={handleSendAnnouncement}
              />

              {/* Class Quick Chat Room */}
              <MentorClassChat
                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                onSendMessage={handleSendChatMessage}
              />

              {/* Class Performance Card */}
              <div className="bg-bg-sidebar p-4 rounded-xl border border-border-light/35 flex items-center gap-4 shadow-xs">
                <div className="bg-primary/10 p-3 rounded-lg text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase font-bold text-neutral-medium tracking-wider">
                    Hiệu suất lớp
                  </h4>
                  <p className="text-lg font-extrabold text-primary">
                    84% <span className="text-xs text-emerald-600 font-bold ml-1">+2.5%</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* LEARNER VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Left Content Column (70%) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tab Selector */}
              <div className="flex border-b border-border-light/30">
                <button
                  onClick={() => setLearnerTab("feed")}
                  className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all ${learnerTab === "feed"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-neutral-medium hover:text-primary"
                    }`}
                >
                  Bảng tin
                </button>
                <button
                  onClick={() => setLearnerTab("leaderboard")}
                  className={`px-5 py-3 font-semibold text-sm border-b-2 transition-all ${learnerTab === "leaderboard"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-neutral-medium hover:text-primary"
                    }`}
                >
                  Bảng xếp hạng
                </button>
              </div>

              {/* Bảng Tin content */}
              {learnerTab === "feed" && (
                <ClassFeed
                  feed={classData.activeFeed}
                  onReactionClick={addReaction}
                />
              )}

              {/* Bảng Xếp Hạng content */}
              {learnerTab === "leaderboard" && (
                <ClassLeaderboard
                  leaderboardMode={leaderboardMode}
                  setLeaderboardMode={setLeaderboardMode}
                  individualLeaderboard={mockIndividualLeaderboard}
                  pairLeaderboard={mockPairLeaderboard}
                />
              )}
            </div>

            {/* Right Sidebar Column (30%) */}
            <div className="lg:col-span-3">
              {learnerTab === "feed" ? (
                <ClassPersonnel
                  pairs={classData.activePersonnel}
                  onFindBuddy={findStudyBuddy}
                />
              ) : (
                <ClassLeaderboardSidebar
                  progress="Top 20% Lớp"
                  points="2,150 pts"
                  partnerName="Thúy Hạnh"
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* FAB announcement post trigger (only visible to Creator role on active feed) */}
      {isCreator && creatorTab === "pairs" && (
        <button
          onClick={() => {
            const announcementBox = document.querySelector("textarea");
            if (announcementBox) {
              announcementBox.focus();
              announcementBox.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="fixed bottom-8 right-8 w-14 h-14 bg-secondary hover:bg-secondary/95 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group cursor-pointer"
        >
          <Plus className="w-6 h-6" />
          <span className="absolute right-full mr-4 bg-neutral-dark text-white px-3 py-1.5 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-md">
            Gửi thông báo lớp
          </span>
        </button>
      )}
    </main>
  );
};

export default ClassPage;
