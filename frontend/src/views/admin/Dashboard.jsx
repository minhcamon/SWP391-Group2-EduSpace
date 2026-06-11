import { useEffect, useState } from "react";
import Sidebar from "@/components/layouts/Sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import {
    ArrowUpRight,
    BookOpen,
    ClipboardList,
    Clock,
    Inbox,
    Mail,
    UserPlus,
    Users,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CourseTable from "@/modules/course-lifecycle/components/CourseTable";
import ReloadButton from "@/components/ui/ReloadButton";
import EmptyState from "@/components/ui/EmptyState";
import useCourse from "@/modules/admin/hooks/useCourse";

// 1. MOCKUP DATA GIẢ LẬP ĐỒNG BỘ VỚI DB DỰ ÁN EDUSPACE
const MOCK_STATS = {
    totalStudents: 1240,
    totalCourses: 48,
    pendingCreatorRequests: 2,
    pendingCourses: 3,
};

const MOCK_RECENT_COURSES = [
    {
        id: 101,
        title: "Xây dựng Kiến trúc Cloud Native với AWS & Kubernetes",
        creatorFullName: "Hoàng Long Vũ",
        createdAt: "2026-06-10T08:30:00Z",
        status: "PENDING",
    },
    {
        id: 102,
        title: "Làm chủ Docker & CI/CD Pipeline cho Lập trình viên",
        creatorFullName: "Phạm Thành Nam",
        createdAt: "2026-06-09T14:20:00Z",
        status: "PENDING",
    },
    {
        id: 103,
        title: "Phát triển Ứng dụng Di động với Flutter",
        creatorFullName: "Đỗ Thùy Linh",
        createdAt: "2026-06-08T09:15:00Z",
        status: "PENDING",
    },
];

const MOCK_CREATOR_REQUESTS = [
    {
        id: 1,
        user_id: 201,
        full_name: "Nguyễn Văn Minh",
        email: "minhnn@fe.edu.vn",
        document_urls:
            "Em đã hoàn thành khóa Java Web với điểm số 9.0. Có 6 tháng kinh nghiệm làm trợ giảng thực tế...",
        status: "PENDING",
        created_at: "2026-06-10T10:00:00Z",
    },
    {
        id: 2,
        user_id: 205,
        full_name: "Trần Thu Hà",
        email: "hatt@fe.edu.vn",
        document_urls:
            "Điểm tổng kết môn Kiểm thử tự động đạt 8.5. Đủ quỹ thời gian rảnh rỗi vào buổi tối để hỗ trợ học viên...",
        status: "PENDING",
        created_at: "2026-06-10T11:15:00Z",
    },
];

const Dashboard = () => {
    const [recentCourses, setRecentCourses] = useState(MOCK_RECENT_COURSES);
    const [creatorRequests, setCreatorRequests] = useState(
        MOCK_CREATOR_REQUESTS,
    );
    const [stats, setStats] = useState(MOCK_STATS);

    const {
        pendingCourses,
        isLoading,
        fetchPendingCourses,
        handleApprove,
        handleReject,
    } = useCourse("Admin Dashboard");

    useEffect(() => {
        fetchPendingCourses();
    }, [fetchPendingCourses]);

    return (
        <div className="flex w-full min-h-screen bg-gray-50 text-gray-800">
            <Sidebar />
            <main className="grow p-8 min-w-0 space-y-8">
                <Card className="p-6 bg-white border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-secondary">
                            Admin Dashboard
                        </CardTitle>
                        <CardDescription>
                            Chào mừng đến với hệ thống quản trị EduSpace
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* ==========================================================
                PHẦN 1: CẤU TRÚC GRID 4 THẺ THỐNG KÊ TỔNG QUAN (STATS)
               ========================================================== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Thẻ 1: Tổng Học viên */}
                    <Card className="bg-white border-slate-200/80 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Tổng Học viên
                            </CardTitle>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Users size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats.totalStudents}
                            </div>
                            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                                <ArrowUpRight size={14} /> +4.8%{" "}
                                <span className="text-slate-400">
                                    so với tháng trước
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    {/* Thẻ 2: Tổng Khóa học */}
                    <Card className="bg-white border-slate-200/80 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Tổng Khóa học
                            </CardTitle>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <BookOpen size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats.totalCourses}
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-1">
                                Hệ thống lớp học 10 người
                            </p>
                        </CardContent>
                    </Card>

                    {/* Thẻ 3: Yêu cầu Creator mới */}
                    <Card className="bg-white border-slate-200/80 shadow-sm relative overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Yêu cầu Creator mới
                            </CardTitle>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                <UserPlus size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {stats.pendingCreatorRequests}
                            </div>
                            <p className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                                <Clock size={12} /> Cần duyệt hồ sơ ứng tuyển
                            </p>
                        </CardContent>
                    </Card>

                    {/* Thẻ 4: Khóa học chờ duyệt */}
                    <Card className="bg-white border-slate-200/80 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                                Khóa học chờ duyệt
                            </CardTitle>
                            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                <Clock size={20} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">
                                {pendingCourses.length}
                            </div>
                            <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                                <Clock size={12} /> Đang nằm trong hàng chờ giáo
                                trình
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end">
                    <ReloadButton
                        action={fetchPendingCourses}
                        isLoading={isLoading}
                    />
                </div>

                {/* CẤU TRÚC GRID CHIA 2 KHỐI NỘI DUNG CHÍNH */}
                <div className="flex flex-col gap-8">
                    {/* ==========================================================
                    PHẦN 2: BẢNG KIỂM DUYỆT KHÓA HỌC (RECENT COURSE REQUESTS)
                   ========================================================== */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-900 px-1">
                            <ClipboardList size={20} className="text-primary" />
                            <h2 className="text-lg font-bold">
                                Khóa học chờ duyệt
                            </h2>
                        </div>
                        {pendingCourses.length === 0 ? (
                            <EmptyState
                                icon={Inbox}
                                description="Hàng chờ trống. Không có khóa học nào cần xử lý."
                            />
                        ) : (
                            <CourseTable
                                courses={pendingCourses}
                                isHistory={false}
                                onApproveClick={handleApprove}
                                onRejectClick={handleReject}
                            />
                        )}
                    </div>

                    {/* ==========================================================
                    PHẦN 3: BẢNG YÊU CẦU LÀM CREATOR (RECENT CREATOR REQUESTS)
                   ========================================================== */}
                    <Card className="bg-white border-slate-200/80 shadow-sm flex flex-col justify-between overflow-hidden">
                        <div>
                            <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <UserPlus
                                        size={18}
                                        className="text-amber-500"
                                    />{" "}
                                    Đăng ký nâng quyền tài khoản
                                </CardTitle>
                                <CardDescription>
                                    Hồ sơ học viên ứng tuyển lên vai trò giảng
                                    dạy / cứu trợ (Creator/Mentor).
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-0">
                                {creatorRequests.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400 text-sm font-medium">
                                        Hàng chờ đơn nâng quyền trống.
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/30 hover:bg-transparent">
                                                <TableHead className="pl-6 py-3 font-bold">
                                                    Ứng viên
                                                </TableHead>
                                                <TableHead className="font-bold">
                                                    Minh chứng trình bày
                                                </TableHead>
                                                <TableHead className="w-36 text-right pr-6 font-bold">
                                                    Tác vụ
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {creatorRequests.map((req) => (
                                                <TableRow
                                                    key={req.id}
                                                    className="hover:bg-slate-50/40 transition-colors"
                                                >
                                                    <TableCell className="space-y-0.5 pl-6 w-56">
                                                        <div className="font-bold text-slate-900">
                                                            {req.full_name}
                                                        </div>
                                                        <div className="text-xs text-slate-500 flex items-center gap-1 truncate max-w-[180px]">
                                                            <Mail size={12} />{" "}
                                                            {req.email}
                                                        </div>
                                                        <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded w-fit">
                                                            UID: {req.user_id}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p
                                                            className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100 max-w-xs"
                                                            title={
                                                                req.document_urls
                                                            }
                                                        >
                                                            {req.document_urls}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-6">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleCreatorAction(
                                                                        req.id,
                                                                        "APPROVED",
                                                                    )
                                                                }
                                                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold h-8 cursor-pointer"
                                                            >
                                                                Duyệt nâng quyền
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() =>
                                                                    handleCreatorAction(
                                                                        req.id,
                                                                        "REJECTED",
                                                                    )
                                                                }
                                                                className="text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold h-8 cursor-pointer"
                                                            >
                                                                Từ chối
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
