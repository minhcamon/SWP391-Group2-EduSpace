import React, { useState } from 'react'
import { GraduationCap, Search, Users, AlertCircle, History } from 'lucide-react'
import useClassManagement from '../hooks/useClassManagement'
import MentorClassCard from '../components/mentor-class/MentorClassCard'
import Badge from '@/components/ui/Badge'

const ClassManagementPage = () => {
    const { classes, searchQuery, setSearchQuery, isLoading, filteredClasses } =
        useClassManagement()

    const [activeTab, setActiveTab] = useState('ACTIVE') // ACTIVE, HISTORY

    // Filter classes based on active tab and membershipStatus
    const tabFilteredClasses = filteredClasses.filter((c) => {
        const status = c.membershipStatus || 'ACTIVE'
        if (activeTab === 'ACTIVE') return status === 'ACTIVE'
        return status === 'PENDING_WITHDRAWAL' || status === 'INACTIVE'
    })

    // Calculate statistics only for active classes
    const activeClasses  = classes.filter(c => (c.membershipStatus || 'ACTIVE') === 'ACTIVE')
    const historyClasses = classes.filter(c => {
        const s = c.membershipStatus
        return s === 'PENDING_WITHDRAWAL' || s === 'INACTIVE'
    })
    const totalStudents  = activeClasses.reduce((acc, c) => acc + (c.numberOfPairs ?? 0) * 2, 0)
    const totalSlowPairs = activeClasses.reduce((acc, c) => acc + (c.slowPairs ?? 0), 0)

    return (
        <div className="grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full font-sans">
            {/* Header — đồng bộ MentorDashboardPage */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-dark tracking-tight">
                        Quản lý Lớp học
                    </h1>
                    <p className="text-sm text-neutral-medium mt-1">
                        Danh sách lớp học và học viên bạn đang theo sát và hỗ trợ.
                    </p>
                </div>
            </div>

            {/* KPIs Grid — đồng bộ MentorDashboardPage */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-primary mb-1">
                        {activeClasses.length}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Lớp đang Mentor
                    </span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-border-light/30 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-emerald-600 mb-1">
                        {totalStudents}
                    </span>
                    <span className="text-[10px] text-neutral-medium uppercase font-bold tracking-wide">
                        Học viên phục vụ
                    </span>
                </div>
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60 shadow-sm flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-extrabold text-amber-600 mb-1">
                        {totalSlowPairs}
                    </span>
                    <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wide">
                        Cặp đôi Slow
                    </span>
                </div>
            </div>

            {/* Filter and Search — đồng bộ MentorDashboardPage */}
            <div className="bg-white border border-border-light/35 rounded-2xl p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Tab Controls */}
                <div className="flex gap-1 bg-neutral-lightest p-1 rounded-xl border border-border-light/30 shadow-inner w-full sm:w-auto">
                    <button
                        onClick={() => setActiveTab('ACTIVE')}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTab === 'ACTIVE'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-neutral-medium hover:text-neutral-dark'
                        }`}
                    >
                        Lớp đang quản lý ({activeClasses.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('HISTORY')}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            activeTab === 'HISTORY'
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-neutral-medium hover:text-neutral-dark'
                        }`}
                    >
                        <History size={13} />
                        <span>Lịch sử lớp học ({historyClasses.length})</span>
                    </button>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-2.5 text-neutral-light w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm lớp học, khóa học..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary transition-all duration-200"
                    />
                </div>
            </div>

            {/* Classes Grid */}
            {isLoading ? (
                <div className="grow flex items-center justify-center min-h-[300px]">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : tabFilteredClasses.length === 0 ? (
                <div className="bg-white border border-border-light/35 rounded-2xl p-12 text-center shadow-sm">
                    <GraduationCap size={48} className="mx-auto text-neutral-light mb-4" />
                    <h3 className="text-lg font-bold text-neutral-dark mb-1">
                        {activeTab === 'ACTIVE' ? 'Không có lớp học nào đang quản lý' : 'Lịch sử lớp học trống'}
                    </h3>
                    <p className="text-sm text-neutral-medium">
                        {searchQuery ? 'Thử nhập từ khóa tìm kiếm khác' : 'Chưa có lớp học nào trong danh mục này'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tabFilteredClasses.map((c) => {
                        const isPending  = c.membershipStatus === 'PENDING_WITHDRAWAL'
                        const isInactive = c.membershipStatus === 'INACTIVE'
                        return (
                            <div key={c.id} className="relative group">
                                <MentorClassCard classItem={c} />
                                {/* Visual indicator badges for history tab */}
                                {activeTab === 'HISTORY' && (
                                    <div className="absolute top-4 right-4 z-10">
                                        {isPending && (
                                            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                                                Chờ duyệt rút lui
                                            </Badge>
                                        )}
                                        {isInactive && (
                                            <Badge className="bg-neutral-100 text-neutral-600 border-neutral-200">
                                                Đã rút lui
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default ClassManagementPage
