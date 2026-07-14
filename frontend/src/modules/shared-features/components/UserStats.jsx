import { Card, CardContent } from "@/components/ui/Card";
import { BookOpen } from "lucide-react";

const UserStats = ({ coursesCount }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Completed Courses */}
            <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <BookOpen size={22} />
                    </div>
                    <div>
                        <span className="text-[10px] text-neutral-medium uppercase tracking-wider font-bold block">Khóa học đăng ký</span>
                        <span className="text-xl font-bold text-neutral-dark">{coursesCount} khóa học</span>
                    </div>
                </CardContent>
            </Card>

            {/* Points - Commented out as requested
            <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
                        <Trophy size={22} />
                    </div>
                    <div>
                        <span className="text-[10px] text-neutral-medium uppercase tracking-wider font-bold block">Điểm cống hiến</span>
                        <span className="text-xl font-bold text-neutral-dark">580 Điểm</span>
                    </div>
                </CardContent>
            </Card>
            */}

            {/* Status Check - Commented out as requested
            <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0px_10px_30px_rgba(79,70,229,0.04)] transition-all">
                <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                        <CheckCircle2 size={22} />
                    </div>
                    <div>
                        <span className="text-[10px] text-neutral-medium uppercase tracking-wider font-bold block">Trạng thái tài khoản</span>
                        <span className="text-sm font-bold text-emerald-600">Đã xác minh</span>
                    </div>
                </CardContent>
            </Card>
            */}
        </div>
    );
};

export default UserStats;
