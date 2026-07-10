import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Bell, ShieldAlert, AlertTriangle, Play, HelpCircle, GraduationCap, Scale, ChevronRight } from "lucide-react";
import useMentorDashboard from "../hooks/useMentorDashboard";
import MentorClassCard from "../components/MentorClassCard";
import MentorToolCard from "../components/MentorToolCard";
import { mockMentorTools, mockIncidents, mockArbitrations } from "../utils/mockData";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import mentorService from "@/services/mentorService";

export const MentorDashboardPage = () => {
    const { classes, isLoading } = useMentorDashboard();
    const [incidents, setIncidents] = useState([]);
    const [arbitrations, setArbitrations] = useState([]);
    const [loadingExtras, setLoadingExtras] = useState(true);

    useEffect(() => {
        const fetchExtras = async () => {
            try {
                const incData = await mentorService.getIncidents();
                const arbData = await mentorService.getArbitrations();
                setIncidents(incData);
                setArbitrations(arbData);
            } catch (err) {
                console.error("Lỗi khi tải phụ trợ dashboard", err);
            } finally {
                setLoadingExtras(false);
            }
        };
        fetchExtras();
    }, []);

    if (isLoading || loadingExtras) {
        return (
            <div className="grow flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold text-neutral-medium">
                        Đang tải dữ liệu Mentor...
                    </span>
                </div>
            </div>
        );
    }

    // Calculate statistics
    const assignedClassesCount = classes.length;

    let healthyPairs = 0;
    let slowPairs = 0;
    let brokenPairs = 0;
    classes.forEach(c => {
        c.studyGroups.forEach(sg => {
            if (sg.status === "SLOW") slowPairs++;
            else if (sg.status === "BROKEN") brokenPairs++;
            else healthyPairs++;
        });
    });

    const pendingIncidentsCount = incidents.filter(i => i.status === "PENDING").length;
    const pendingArbitrationsCount = arbitrations.filter(a => a.status === "PENDING").length;

    // Urgent incidents for Rescue Queue
    const rescueQueue = incidents
        .filter(i => i.status !== "RESOLVED")
        .slice(0, 3);

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "CRITICAL":
                return <Badge variant="destructive" className="bg-red-600 text-white font-bold uppercase tracking-wider text-[9px] px-2">Critical</Badge>;
            case "HIGH":
                return <Badge variant="secondary" className="bg-amber-500 text-white font-bold uppercase tracking-wider text-[9px] px-2">High</Badge>;
            default:
                return <Badge variant="outline" className="bg-slate-100 text-neutral-medium border-slate-200 font-bold uppercase tracking-wider text-[9px] px-2">Medium</Badge>;
        }
    };

    const getIncidentTypeLabel = (type) => {
        switch (type) {
            case "PEER_REVIEW_DISPUTE":
                return "Tranh chấp chấm chéo";
            case "INACTIVE_PARTNER":
                return "Bạn học vắng mặt";
            case "MEMBER_CONFLICT":
                return "Xung đột nhóm";
            case "RESCUE_SUPPORT_REQUEST":
                return "Yêu cầu cứu trợ";
            default:
                return type;
        }
    };

    return (
        <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Welcome Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                        Mentor Dashboard
                    </h1>
                    <p className="text-sm text-neutral-medium mt-1">
                        Chào buổi sáng, Mentor. Dưới đây là tổng quan hiệu suất và tình trạng lớp học.
                    </p>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {/* KPI 1 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-primary mb-1">{assignedClassesCount}</span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">Lớp phụ trách</span>
                </div>
                {/* KPI 2 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-emerald-600 mb-1">{healthyPairs}</span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">Cặp học tốt</span>
                </div>
                {/* KPI 3 */}
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-amber-600 mb-1">{slowPairs}</span>
                    <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wide">Cặp học chậm</span>
                </div>
                {/* KPI 4 */}
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-red-600 mb-1">{brokenPairs}</span>
                    <span className="text-[10px] text-red-600 uppercase font-bold tracking-wide">Cặp rạn nứt</span>
                </div>
                {/* KPI 5 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-neutral-dark mb-1">{pendingIncidentsCount}</span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">Sự cố chờ xử lý</span>
                </div>
                {/* KPI 6 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-neutral-dark mb-1">{pendingArbitrationsCount}</span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">Đơn chờ phân xử</span>
                </div>
            </div>

            {/* Main Layout 7:3 (Rescue Queue & Alerts) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-10">
                {/* Left Column (7): Rescue Queue */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-dark">Hàng đợi Cứu trợ (Rescue Queue)</h3>
                        <Link
                            to="/mentor/incidents"
                            className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                        >
                            <span>Xem tất cả sự cố</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    {rescueQueue.length === 0 ? (
                        <div className="bg-white border border-border-light/35 rounded-2xl p-8 text-center shadow-sm">
                            <span className="text-sm font-semibold text-neutral-medium">Hiện tại không có sự cố nào cần xử lý.</span>
                        </div>
                    ) : (
                        rescueQueue.map((inc) => (
                            <Card key={inc.id} className="border border-border-light/35 shadow-sm hover:shadow-md transition-all duration-200">
                                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            {getPriorityBadge(inc.priority)}
                                            <span className="text-xs font-semibold text-neutral-medium">• {inc.createdTime}</span>
                                        </div>
                                        <h4 className="font-bold text-neutral-dark text-sm leading-snug">
                                            {getIncidentTypeLabel(inc.type)} - Lớp {inc.classId}
                                        </h4>
                                        <p className="text-xs text-neutral-medium mt-1 line-clamp-1">{inc.reason}</p>
                                    </div>
                                    <div className="shrink-0 flex items-center">
                                        <Link
                                            to={`/mentor/incidents/${inc.id}`}
                                            className="w-full md:w-auto px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/95 transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                                        >
                                            <Play size={12} />
                                            <span>Xử lý ngay</span>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Right Column (3): Recent Alerts & Resources */}
                <div className="lg:col-span-3 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-neutral-dark">Cảnh báo gần đây</h3>
                    <div className="bg-white rounded-2xl border border-border-light/30 shadow-sm overflow-hidden flex flex-col">
                        {/* {/* Alert 1 */}
                        {/* <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex gap-3">
              <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={16} />
              <div>
                <h5 className="text-xs font-bold text-neutral-dark">Rạn nứt cặp đôi!</h5>
                <p className="text-[11px] text-neutral-medium mt-0.5">Phát hiện Bình & Chi (L04) không liên lạc 3 ngày.</p>
                <span className="text-[10px] text-neutral-light font-semibold block mt-1">Vừa xong</span>
              </div>
            </div> */}

                        {/* Alert 2 */}
                        {/* <div className="p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors flex gap-3">
              <Scale className="text-amber-500 shrink-0 mt-0.5" size={16} />
              <div>
                <h5 className="text-xs font-bold text-neutral-dark">Yêu cầu chấm phân định</h5>
                <p className="text-[11px] text-neutral-medium mt-0.5">Nguyễn Văn A gửi đơn khiếu nại chấm chéo.</p>
                <span className="text-[10px] text-neutral-light font-semibold block mt-1">45 phút trước</span>
              </div>
            </div> */}

                        {/* Alert 3 */}
                        {/* <div className="p-4 hover:bg-slate-50 transition-colors flex gap-3">
              <GraduationCap className="text-primary shrink-0 mt-0.5" size={16} />
              <div>
                <h5 className="text-xs font-bold text-neutral-dark">Báo cáo lớp L05</h5>
                <p className="text-[11px] text-neutral-medium mt-0.5">Tiến độ trung bình lớp học giảm 2% tuần này.</p>
                <span className="text-[10px] text-neutral-light font-semibold block mt-1">2 giờ trước</span>
              </div>
            </div> */}
                    </div>

                    {/* Quick Help Guide Card */}
                    {/* <div className="bg-primary text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
                        <h4 className="font-bold text-sm flex items-center gap-1">
                            <HelpCircle size={16} />
                            Cần trợ giúp?
                        </h4>
                        <p className="text-[11px] text-white/80 mt-1.5 leading-relaxed">
                            Truy cập Sổ tay Hướng dẫn Mentor hoặc liên hệ quản trị viên học thuật khi gặp khó khăn.
                        </p>
                        <button className="w-full mt-3 py-2 bg-white text-primary text-xs font-bold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                            Sổ tay Mentor
                        </button>
                    </div> */}
                </div>
            </div>

            {/* Retained: Mentor Classes Section */}
            <h3 className="text-lg font-bold text-neutral-dark mb-4">Các Lớp học đang Mentor</h3>
            {classes.length === 0 ? (
                <div className="bg-white border border-border-light/35 rounded-2xl p-8 text-center shadow-sm">
                    <span className="text-sm font-semibold text-neutral-medium">Bạn hiện tại chưa được phân công làm Mentor cho lớp nào.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {classes.map((classItem) => (
                        <MentorClassCard key={classItem.id} classItem={classItem} />
                    ))}
                </div>
            )}

            {/* Retained: Secondary Mentor Tools */}
            <section className="mt-10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-medium mb-4">
                    Công cụ hỗ trợ
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {mockMentorTools.map((tool) => (
                        <MentorToolCard key={tool.id} tool={tool} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default MentorDashboardPage;
