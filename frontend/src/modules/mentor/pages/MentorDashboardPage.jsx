import React from 'react'
import { Link } from 'react-router'
import { Users, AlertTriangle, Play, ChevronRight } from 'lucide-react'
import useMentorDashboard from '../hooks/useMentorDashboard'
import MentorClassCard from '../components/mentor-class/MentorClassCard'
import MentorToolCard from '../components/mentor-dashboard/MentorToolCard'
import { mockMentorTools } from '../utils/mockData'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export const MentorDashboardPage = () => {
    const {
        classes,
        isLoading,
        assignedClassesCount,
        healthyPairs,
        slowPairs,
        brokenPairs,
        pendingIncidentsCount,
        rescueQueue
    } = useMentorDashboard()

    if (isLoading) {
        return (
            <div className="grow flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-semibold text-neutral-medium">
                        Đang tải dữ liệu Mentor...
                    </span>
                </div>
            </div>
        )
    }

    const getIncidentTypeLabel = (type) => {
        switch (type) {
            case 'ASSIGNMENT_DISPUTE':
                return 'Tranh chấp bài tập'
            case 'INACTIVE_PARTNER':
                return 'Bạn học vắng mặt'
            case 'MEMBER_CONFLICT':
                return 'Xung đột nhóm'
            case 'RESCUE_SUPPORT_REQUEST':
                return 'Yêu cầu cứu trợ'
            default:
                return type
        }
    }

    return (
        <main className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {/* Welcome Header Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                        Mentor Dashboard
                    </h1>
                    <p className="text-sm text-neutral-medium mt-1">
                        Chào buổi sáng, Mentor. Dưới đây là tổng quan hiệu suất và tình
                        trạng lớp học.
                    </p>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {/* KPI 1 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-primary mb-1">
                        {assignedClassesCount}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Lớp phụ trách
                    </span>
                </div>
                {/* KPI 2 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-emerald-600 mb-1">
                        {healthyPairs}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Cặp học tốt
                    </span>
                </div>
                {/* KPI 3 */}
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-amber-600 mb-1">
                        {slowPairs}
                    </span>
                    <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wide">
                        Cặp học chậm
                    </span>
                </div>
                {/* KPI 4 */}
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-red-600 mb-1">
                        {brokenPairs}
                    </span>
                    <span className="text-[10px] text-red-600 uppercase font-bold tracking-wide">
                        Cặp rạn nứt
                    </span>
                </div>
                {/* KPI 5 */}
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-neutral-dark mb-1">
                        {pendingIncidentsCount}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Sự cố chờ xử lý
                    </span>
                </div>
            </div>

            {/* Main Layout 7:3 (Rescue Queue & Alerts) */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mb-10">
                {/* Left Column (7): Rescue Queue */}
                <div className="lg:col-span-12 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-neutral-dark">
                            Hàng đợi Cứu trợ (Rescue Queue)
                        </h3>
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
                            <span className="text-sm font-semibold text-neutral-medium">
                                Hiện tại không có sự cố nào cần xử lý.
                            </span>
                        </div>
                    ) : (
                        rescueQueue.map((inc) => (
                            <Card
                                key={inc.id}
                                className="border border-border-light/35 shadow-sm hover:shadow-md transition-all duration-200"
                            >
                                <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <span className="text-xs font-semibold text-neutral-medium">
                                                {inc.createdAt
                                                    ? new Date(inc.createdAt).toLocaleString('vi-VN')
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-neutral-dark text-sm leading-snug">
                                            {getIncidentTypeLabel(inc.incidentType)}
                                        </h4>
                                        <p className="text-xs text-neutral-medium mt-1 line-clamp-1">
                                            {inc.reason}
                                        </p>
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
                {/* <div className="lg:col-span-3 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-neutral-dark">Cảnh báo gần đây</h3>
                    <div className="bg-white rounded-2xl border border-border-light/30 shadow-sm overflow-hidden flex flex-col p-4 text-center">
                        <span className="text-xs text-neutral-medium font-semibold">Không có cảnh báo mới.</span>
                    </div>
                </div> */}
            </div>

            {/* Retained: Mentor Classes Section */}
            <h3 className="text-lg font-bold text-neutral-dark mb-4">
                Các Lớp học đang Mentor
            </h3>
            {classes.length === 0 ? (
                <div className="bg-white border border-border-light/35 rounded-2xl p-8 text-center shadow-sm">
                    <span className="text-sm font-semibold text-neutral-medium">
                        Bạn hiện tại chưa được phân công làm Mentor cho lớp nào.
                    </span>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {classes.map((classItem) => (
                        <MentorClassCard
                            key={classItem.id}
                            classItem={classItem}
                        />
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
                        <MentorToolCard
                            key={tool.id}
                            tool={tool}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default MentorDashboardPage
