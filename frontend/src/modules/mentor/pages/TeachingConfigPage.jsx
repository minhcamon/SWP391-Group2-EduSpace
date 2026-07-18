import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';
import useActiveMentorConfig from '../hooks/useActiveMentorConfig';
import { Card, CardContent } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export const TeachingConfigPage = () => {
    const {
        activeCourses,
        isLoading,
        handleRegisterActiveCourse,
        handleUpdateActiveCourseStatus,
        refresh
    } = useActiveMentorConfig();

    if (isLoading) {
        return (
            <div className="grow flex items-center justify-center min-h-[400px] bg-neutral-lightest/30">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold text-neutral-medium">
                        Đang tải danh sách khóa học...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Elegant Header with Gradient Background Decoration */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/95 to-primary-dark text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-primary/20 mb-8">
                <div className="absolute right-0 bottom-0 translate-y-1/4 translate-x-1/4 opacity-10">
                    <BookOpen size={240} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                            Cấu hình giảng dạy
                        </h1>
                        <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">
                            Đăng ký hỗ trợ các khóa học bạn đã hoàn thành (nhận chứng chỉ) và thay đổi trạng thái sẵn sàng nhận lớp. Creator sẽ dựa trên danh sách này để phân công hoặc điều động bạn hỗ trợ học viên.
                        </p>
                    </div>
                    <button
                        onClick={refresh}
                        className="self-start md:self-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-xl px-4 py-2.5 text-xs font-bold transition-all active:scale-[0.98]"
                    >
                        <RefreshCw size={14} className="animate-hover-spin" />
                        <span>Tải lại dữ liệu</span>
                    </button>
                </div>
            </div>

            {/* Empty State */}
            {activeCourses.length === 0 ? (
                <div className="bg-white border border-border-light/40 rounded-3xl p-12 text-center shadow-sm">
                    <div className="w-16 h-16 bg-neutral-lightest/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border-light/20">
                        <AlertCircle size={32} className="text-neutral-light" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-dark mb-2">
                        Chưa có khóa học nào khả dụng
                    </h3>
                    <p className="text-sm text-neutral-medium max-w-md mx-auto leading-relaxed">
                        Bạn cần hoàn thành các khóa học và nhận chứng chỉ (Certificates) để có thể đăng ký giảng dạy. Hãy tiếp tục học tập và đạt chứng chỉ nhé!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCourses.map((course) => {
                        const isAvailable = course.status === 'AVAILABLE';
                        const isBusy = course.status === 'BUSY';

                        return (
                            <Card
                                key={course.courseId}
                                className={`group overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                                    course.isRegistered 
                                        ? 'bg-white border-border-light/40' 
                                        : 'bg-neutral-lightest/20 border-border-light/20'
                                }`}
                            >
                                <CardContent className="p-6 flex flex-col justify-between h-full min-h-[220px]">
                                    {/* Card Header Info */}
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3.5">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                                                {course.subject || 'Khóa học'}
                                            </Badge>
                                            
                                            <div className="flex items-center gap-1 text-emerald-600">
                                                <ShieldCheck size={14} />
                                                <span className="text-[10px] font-bold uppercase tracking-wide">
                                                    Đã chứng nhận
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-neutral-dark text-base leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
                                            {course.courseTitle}
                                        </h3>
                                    </div>

                                    {/* Action & Status Section */}
                                    <div className="mt-6 pt-4 border-t border-border-light/35 flex flex-col gap-3">
                                        {course.isRegistered ? (
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wider">
                                                        Trạng thái nhận lớp
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-1.5">
                                                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                                        <span className={`text-xs font-bold ${isAvailable ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                            {isAvailable ? 'Sẵn sàng nhận lớp' : 'Đang bận / Tạm nghỉ'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action toggle group */}
                                                <div className="bg-neutral-lightest p-1 rounded-xl flex border border-border-light/30 shadow-inner">
                                                    <button
                                                        onClick={() => handleUpdateActiveCourseStatus(course.courseId, 'AVAILABLE')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                            isAvailable
                                                                ? 'bg-emerald-600 text-white shadow-sm'
                                                                : 'text-neutral-medium hover:text-neutral-dark'
                                                        }`}
                                                    >
                                                        Rảnh
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateActiveCourseStatus(course.courseId, 'BUSY')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                                            isBusy
                                                                ? 'bg-amber-500 text-white shadow-sm'
                                                                : 'text-neutral-medium hover:text-neutral-dark'
                                                        }`}
                                                    >
                                                        Bận
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] text-neutral-medium font-semibold italic text-center">
                                                    Bạn chưa đăng ký làm Active Mentor cho khóa học này
                                                </span>
                                                <button
                                                    onClick={() => handleRegisterActiveCourse(course.courseId)}
                                                    className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary/95 hover:to-primary-light/95 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                                                >
                                                    <UserCheck size={14} />
                                                    <span>Đăng ký nhận lớp giảng dạy</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TeachingConfigPage;
