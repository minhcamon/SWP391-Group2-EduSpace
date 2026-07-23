import { Link } from "react-router";
import { Users, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/common/Avatar";

const StudyGroupsList = ({ pairs, handleSendReminder }) => {
    const getGroupDiagnostic = (pair, memberProgresses) => {
        const minProgress = memberProgresses.length > 0 ? Math.min(...memberProgresses) : 0;
        const maxProgress = memberProgresses.length > 0 ? Math.max(...memberProgresses) : 0;

        if (pair.status === "SLOW") {
            if (minProgress < 60 && maxProgress >= 80) {
                return "Có thành viên đang học chậm hơn nhóm";
            }
            return "Cả nhóm đang học chậm";
        }
        if (minProgress >= 90) {
            return "Cả nhóm đã hoàn thành xuất sắc";
        }
        return "Nhóm hoạt động ổn định";
    };

    return (
        <div>
            <h3 className="text-lg font-bold text-neutral-dark mb-4 flex items-center gap-2">
                <Users size={20} className="text-slate-600" />
                <span>Tình trạng Nhóm học tập (Study Groups)</span>
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {pairs.map((pair) => {
                    const memberProgresses = pair.members ? pair.members.map((m) => m.progress ?? 0) : [];
                    const minProgress = memberProgresses.length > 0 ? Math.min(...memberProgresses) : 0;
                    const isWarningGroup = pair.status === "SLOW" || minProgress < 60;
                    const diagnostic = getGroupDiagnostic(pair, memberProgresses);

                    return (
                        <Card key={pair.studyGroupId} className="border border-border-light/35 shadow-sm hover:shadow-md transition-all duration-200">
                            <CardContent className="p-5 flex flex-col md:flex-row items-stretch justify-between gap-6">

                                {/* Left: Group Code & Status */}
                                <div className="flex flex-col justify-between shrink-0 md:w-36">
                                    <div>
                                        <p className="font-extrabold text-neutral-dark text-base">Nhóm #{pair.studyGroupId}</p>
                                        <p className="text-[10px] text-neutral-medium font-bold mt-0.5">ID: PAIR-0{pair.studyGroupId}</p>
                                    </div>
                                    <div className="mt-3">
                                        <Badge
                                            variant={isWarningGroup ? "destructive" : "approved"}
                                            className="font-bold uppercase tracking-wider text-[9px] px-2 py-0.5"
                                        >
                                            {isWarningGroup ? "Cảnh báo" : "Hoạt động tốt"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Center: Dynamic Members List (Handles Group of 3) */}
                                <div className="flex-1 flex flex-wrap items-center gap-4 min-w-0">
                                    {pair.members && pair.members.map((member, idx) => {
                                        const progressVal = memberProgresses[idx] || 0;
                                        return (
                                            <div
                                                key={member.userId || idx}
                                                className="flex-1 min-w-31.25 bg-slate-50/50 border border-slate-100 rounded-xl p-3 flex flex-col items-center text-center shadow-xs"
                                            >
                                                <Avatar
                                                    src={member.avatarUrl}
                                                    alt={member.fullName}
                                                    className="w-10 h-10 border border-slate-200 bg-white"
                                                />
                                                <span className="text-xs font-bold text-neutral-dark truncate w-full mt-1.5" title={member.fullName}>
                                                    {member.fullName}
                                                </span>

                                                {/* Member Progress Under Avatar */}
                                                <div className="w-full mt-2.5">
                                                    <div className="flex items-center justify-between text-[9px] font-extrabold text-neutral-medium mb-1">
                                                        <span>Học phần</span>
                                                        <span className="text-neutral-dark">{progressVal}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 rounded-full h-1">
                                                        <div
                                                            className={`h-1 rounded-full ${progressVal < 60 ? "bg-red-500 animate-pulse" : "bg-primary"
                                                                }`}
                                                            style={{ width: `${progressVal}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Right: Diagnostics & Actions */}
                                <div className="flex flex-col justify-between items-end shrink-0 md:w-44 text-right">
                                    <div>
                                        <span className="text-[10px] font-bold text-neutral-medium uppercase tracking-wider block">Chẩn đoán</span>
                                        <span className={`text-xs font-bold block mt-1 ${isWarningGroup ? "text-red-600" : "text-emerald-700"}`}>
                                            {diagnostic}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                        {isWarningGroup && (
                                            <button
                                                onClick={() => handleSendReminder(pair.studyGroupId)}
                                                className="flex-1 md:flex-none p-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl transition-all active:scale-98 cursor-pointer flex items-center justify-center"
                                                title="Nhắc nhở học tập"
                                            >
                                                <Bell size={14} />
                                            </button>
                                        )}
                                        <Link
                                            to={`/mentor/pairs/${pair.studyGroupId}`}
                                            className="flex-1 md:flex-none px-4 py-2 border border-primary hover:bg-primary/5 text-primary text-xs font-bold rounded-xl transition-all duration-150 active:scale-98 text-center"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>

                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default StudyGroupsList;
