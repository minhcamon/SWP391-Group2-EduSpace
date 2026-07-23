import React from 'react'
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeftRight
} from 'lucide-react'
import useWithdrawRequests from '../hooks/useWithdrawRequests'
import WithdrawRequestCard from '../components/WithdrawRequestCard'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import EmptyState from '@/components/ui/EmptyState'

export const WithdrawRequestsPage = () => {
  const {
    requests,
    isLoading,
    activeFilter,
    setActiveFilter,
    loadingMentorsMap,
    availableMentorsMap,
    selectedMentorMap,
    isActioningMap,
    filteredRequests,
    fetchRequests,
    handleReject,
    handleApproveDirect,
    handleLoadAvailableMentors,
    handleInitiateHandover,
    handleApproveHandover,
    handleTakeOver,
    setSelectedMentorForRequest
  } = useWithdrawRequests()

  // KPI counts
  const totalCount = requests.length
  const pendingCount = requests.filter((r) => r.status === 'PENDING').length
  const handoverCount = requests.filter((r) => r.status === 'HANDOVER_PENDING').length
  const completedCount = requests.filter((r) => r.status === 'COMPLETED').length
  const rejectedCount = requests.filter((r) => r.status === 'REJECTED').length

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-300">

      {/* Header section — đồng bộ với CourseManagementPage */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
          <CardHeader className="p-0 flex-1">
            <CardTitle className="text-2xl font-bold text-secondary">
              Yêu cầu ngừng giảng dạy (Withdrawal)
            </CardTitle>
            <CardDescription className="text-sm text-neutral-medium mt-1">
              Quản lý và phê duyệt các đơn xin rút lui giảng dạy của Mentors. Đảm bảo quy trình bàn giao an toàn, không làm gián đoạn học tập.
            </CardDescription>
          </CardHeader>
        </div>
      </Card>

      {/* KPI Stats — đồng bộ với CourseManagementPage */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(8,151,200,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
              <Users className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Tổng số đơn
              </span>
              <span className="text-2xl font-black text-neutral-dark">{totalCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(242,128,32,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className={`text-xl ${pendingCount > 0 ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Chờ xử lý
              </span>
              <span className="text-2xl font-black text-neutral-dark">{pendingCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(59,130,246,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <ArrowLeftRight className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Đang bàn giao
              </span>
              <span className="text-2xl font-black text-neutral-dark">{handoverCount}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-border-light/30 hover:shadow-[0px_10px_30px_rgba(117,187,71,0.03)] transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary/10 rounded-xl flex items-center justify-center text-tertiary">
              <CheckCircle2 className="text-xl" />
            </div>
            <div>
              <span className="text-[10px] text-neutral-medium font-bold uppercase tracking-wider block">
                Hoàn thành
              </span>
              <span className="text-2xl font-black text-neutral-dark">{completedCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs Row — đồng bộ với CourseManagementPage */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white p-4 rounded-2xl border border-border-light/30 shadow-sm w-full">
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full lg:w-auto">
          <TabsList className="flex flex-row flex-wrap h-auto! gap-2 bg-transparent p-0 w-full justify-start py-1">
            {[
              { label: 'Tất cả', value: 'ALL', count: totalCount },
              { label: 'Chờ duyệt', value: 'PENDING', count: pendingCount },
              { label: 'Đang bàn giao', value: 'HANDOVER_PENDING', count: handoverCount },
              { label: 'Hoàn thành', value: 'COMPLETED', count: completedCount },
              { label: 'Đã từ chối', value: 'REJECTED', count: rejectedCount }
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-transparent shrink-0 ${
                  activeFilter === tab.value
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-neutral-medium hover:bg-slate-50'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold transition-colors ${
                    activeFilter === tab.value
                      ? 'bg-primary text-white'
                      : 'bg-neutral-dark/10 text-neutral-dark'
                  }`}
                >
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Requests Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            activeFilter === 'ALL'
              ? 'Chưa có yêu cầu nào'
              : activeFilter === 'PENDING'
                ? 'Không có đơn nào đang chờ duyệt'
                : activeFilter === 'HANDOVER_PENDING'
                  ? 'Không có đơn nào đang bàn giao'
                  : activeFilter === 'COMPLETED'
                    ? 'Chưa có đơn nào hoàn thành'
                    : 'Chưa có đơn nào bị từ chối'
          }
          description="Hiện không có yêu cầu ngừng giảng dạy nào trùng khớp với bộ lọc đã chọn."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <WithdrawRequestCard
              key={req.id}
              req={req}
              onReject={handleReject}
              onApproveDirect={handleApproveDirect}
              onLoadMentors={handleLoadAvailableMentors}
              onInitiateHandover={handleInitiateHandover}
              onApproveHandover={handleApproveHandover}
              onTakeOver={handleTakeOver}
              isLoadingMentors={loadingMentorsMap[req.id] || false}
              availableMentors={availableMentorsMap[req.id]}
              selectedMentorId={selectedMentorMap[req.id]}
              onSelectMentor={setSelectedMentorForRequest}
              isActioning={isActioningMap[req.id] || false}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default WithdrawRequestsPage
