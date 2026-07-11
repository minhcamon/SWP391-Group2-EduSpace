import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, ShieldAlert, Play, MessageSquare } from "lucide-react";
import mentorService from "@/services/mentorService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { runWithLoading } from "@/utils/utils";
import { toast } from "sonner";

// Import extracted presenter components
import ClassDetailHero from "@/modules/mentor/components/ClassDetailHero";
import StudyGroupsList from "@/modules/mentor/components/StudyGroupsList";
import SidebarModuleTimeline from "@/modules/mentor/components/SidebarModuleTimeline";

const ClassDetailPage = () => {
    const { classId } = useParams();
    const [classDetail, setClassDetail] = useState(null);
    const [pairs, setPairs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isStartingModule, setIsStartingModule] = useState(false);
    const selectedModuleRef = React.useRef(null);

    // Local state for course modules to handle interactive progression
    const [modules, setModules] = useState([
        { id: 1, title: "Module 1: Spring Boot Core & REST API Basics", status: "COMPLETED", completionRate: 100 },
        { id: 2, title: "Module 2: Spring Data JPA & Relationship Mapping", status: "ACTIVE", completionRate: 85 },
        { id: 3, title: "Module 3: Spring Security, JWT & OAuth2 Security", status: "LOCKED", completionRate: 0 },
        { id: 4, title: "Module 4: Spring Boot Testing, Docker & Deployment", status: "LOCKED", completionRate: 0 },
    ]);

    const [selectedModuleId, setSelectedModuleId] = useState(2);

    useEffect(() => {
        if (selectedModuleRef.current) {
            selectedModuleRef.current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest"
            });
        }
    }, [selectedModuleId]);

    useEffect(() => {
        const fetchClassDetail = async () => {
            try {
                await runWithLoading(setIsLoading, async () => {
                    const detailData = await mentorService.getClassById(classId);
                    setClassDetail(detailData);

                    try {
                        const pairsData = await mentorService.getClassPairs(classId);
                        setPairs(pairsData || []);
                    } catch (pairErr) {
                        console.error("Failed to load pairs:", pairErr);
                        setPairs([]);
                    }
                });
            } catch (err) {
                toast.error(err.message || "Không thể tải thông tin chi tiết lớp học!");
            }
        };
        fetchClassDetail();
    }, [classId]);

    const handleStartNextModule = async (nextModuleId) => {
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
        toast.success("Đã khởi chạy học phần tiếp theo thành công!");
    };

    const handleSendReminder = (studyGroupId) => {
        toast.success(`Đã gửi thông báo nhắc nhở học tập tới Nhóm #PAIR-0${studyGroupId}!`);
    };

    const handlePrevModule = () => {
        setSelectedModuleId((prev) => Math.max(1, prev - 1));
    };

    const handleNextModule = () => {
        setSelectedModuleId((prev) => Math.min(modules.length, prev + 1));
    };

    const getSelectedModuleDetails = () => {
        const m = modules.find((mod) => mod.id === selectedModuleId);
        if (!m) return null;

        const contents = {
            1: [
                { type: "Bài học", name: "Giới thiệu Spring Boot Ecosystem & Maven" },
                { type: "Thực hành", name: "Thiết lập môi trường & Tạo Hello Controller" },
                { type: "Bài tập", name: "Viết REST API đầu tiên trả về JSON" }
            ],
            2: [
                { type: "Bài học", name: "Spring Data JPA & Entity Lifecycle" },
                { type: "Thực hành", name: "Cấu hình Datasource & Viết JPA Repository" },
                { type: "Bài tập", name: "Liên kết Quan hệ One-to-Many & Many-to-Many" }
            ],
            3: [
                { type: "Bài học", name: "Spring Security Architecture & Filter Chain" },
                { type: "Thực hành", name: "Tích hợp JWT & Phân quyền User" },
                { type: "Bài tập", name: "Bảo mật các endpoint Spring REST API" }
            ],
            4: [
                { type: "Bài học", name: "Kiểm thử Unit Test & Integration Test" },
                { type: "Thực hành", name: "Dockerize Ứng dụng Spring Boot" },
                { type: "Bài tập", name: "CI/CD Deployment lên Server" }
            ]
        };

        return {
            ...m,
            contents: contents[m.id] || []
        };
    };

    if (isLoading) {
        return (
            <div className="grow flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!classDetail) {
        return (
            <div className="grow max-w-7xl mx-auto px-4 py-8 text-center">
                <h2 className="text-xl font-bold text-neutral-dark mb-2">Không tìm thấy lớp học</h2>
                <Link to="/mentor/classes" className="text-primary hover:underline text-sm font-semibold">
                    Quay lại danh sách lớp học
                </Link>
            </div>
        );
    }

    const activeModule = modules.find((m) => m.status === "ACTIVE");
    const nextModule = modules.find((m) => m.status === "LOCKED");
    const showReminder = activeModule && activeModule.completionRate >= 80;

    return (
        <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Back button & Header */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    to="/mentor/classes"
                    className="inline-flex items-center gap-1.5 text-neutral-medium hover:text-primary text-sm font-semibold transition-colors duration-200"
                >
                    <ArrowLeft size={16} />
                    <span>Quay lại Quản lý Lớp học</span>
                </Link>
            </div>

            {/* Hero Class Banner */}
            <ClassDetailHero
                classDetail={classDetail}
                activeModule={activeModule}
                totalModules={modules.length}
            />

            {/* Main Grid: 7:3 */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

                {/* Left Column (7): Study Groups & System Alerts */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* System Reminder alert */}
                    {showReminder && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4.5 flex items-start gap-3.5 shadow-sm hover:shadow-md transition-all duration-300">
                            <ShieldAlert className="text-amber-600 shrink-0 mt-0.5" size={20} />
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-amber-800">Cảnh báo hệ thống: Kích hoạt học phần mới</h4>
                                <p className="text-xs text-amber-700 font-semibold mt-1 leading-relaxed">
                                    Lớp học hiện tại đã hoàn thành khóa học phần <span className="font-bold text-amber-900">"{activeModule.title}"</span> đạt tỷ lệ <span className="font-bold text-amber-900">{activeModule.completionRate}%</span>. Bạn cần chuẩn bị kích hoạt học phần mới để tránh làm trễ tiến độ của lớp học.
                                </p>
                                {nextModule && (
                                    <button
                                        onClick={() => handleStartNextModule(nextModule.id)}
                                        disabled={isStartingModule}
                                        className="mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-98 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                                    >
                                        <Play size={12} />
                                        <span>{isStartingModule ? "Đang xử lý..." : `Bắt đầu ${nextModule.title.split(":")[0]}`}</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Study Groups List */}
                    <StudyGroupsList
                        pairs={pairs}
                        handleSendReminder={handleSendReminder}
                    />
                </div>

                {/* Right Column (3): Swipeable Modules & Quick Actions */}
                <div className="lg:col-span-3 flex flex-col gap-6">

                    {/* Interactive Modules Timeline Card */}
                    <SidebarModuleTimeline
                        modules={modules}
                        selectedModuleId={selectedModuleId}
                        setSelectedModuleId={setSelectedModuleId}
                        selectedModuleRef={selectedModuleRef}
                        nextModule={nextModule}
                        isStartingModule={isStartingModule}
                        handleStartNextModule={handleStartNextModule}
                        getSelectedModuleDetails={getSelectedModuleDetails}
                        handlePrevModule={handlePrevModule}
                        handleNextModule={handleNextModule}
                    />

                    {/* Quick Actions Panel */}
                    <Card className="border border-border-light/35 shadow-sm bg-slate-50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-neutral-dark uppercase tracking-wider">Hành động nhanh</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-3">
                            <Link
                                to={`/mentor/chat?classId=${classId}`}
                                className="w-full py-2.5 bg-white border border-border-light hover:bg-slate-100 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm text-neutral-dark"
                            >
                                <MessageSquare size={14} />
                                <span>Nhắn tin tập thể lớp</span>
                            </Link>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
};

export default ClassDetailPage;
