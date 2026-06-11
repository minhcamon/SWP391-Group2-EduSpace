import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowUpRight, BookOpen, Clock, UserPlus, Users } from "lucide-react";

const Stat = ({ pendingCourses, stats }) => {
    const pendingCoursesLength = pendingCourses.length;

    return (
        <>
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
                        {pendingCoursesLength}
                    </div>
                    <p className="text-xs text-rose-600 font-semibold mt-1 flex items-center gap-1">
                        <Clock size={12} /> Đang nằm trong hàng chờ giáo trình
                    </p>
                </CardContent>
            </Card>
        </>
    );
};

export default Stat;
