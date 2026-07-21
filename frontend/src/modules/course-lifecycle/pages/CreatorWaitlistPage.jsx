import { useState, useEffect } from 'react'
import { LuUsers } from 'react-icons/lu'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import creatorService from '@/services/creatorService'
import WaitlistTable from '@/modules/course-lifecycle/components/WaitlistTable'
import { toast } from 'sonner'

export default function CreatorWaitlistPage() {
  const [waitlists, setWaitlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWaitlists = async () => {
    try {
      setLoading(true)
      const res = await creatorService.getWaitlists()
      setWaitlists(res)
      setError(null)
    } catch (err) {
      console.error('Error fetching waitlists:', err)
      setError(err.message || 'Không thể tải danh sách hàng chờ')
    } finally {
      setLoading(false)
    }
  }

  const handleStartClass = async (waitlistId) => {
    try {
      await creatorService.startClassFromWaitlist(waitlistId)
      setWaitlists(prev => prev.map(wl => wl.id === waitlistId ? { ...wl, status: 'FULLED' } : wl))
      toast.success("Bắt đầu lớp học thành công! Học viên sẽ nhận được thông báo nhập học.")
    } catch (err) {
      toast.error(err.message || "Không thể bắt đầu lớp học")
      throw err
    }
  }

  useEffect(() => {
    fetchWaitlists()
  }, [])

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Header section */}
      <Card className="p-6 bg-white border border-gray-200 shadow-sm">
        <CardHeader className="p-0 flex-1">
          <CardTitle className="text-2xl font-bold text-secondary flex items-center gap-2">
            <LuUsers className="text-primary" /> Quản lý hàng chờ (Waitlist)
          </CardTitle>
          <CardDescription className="text-sm text-neutral-medium mt-1">
            Theo dõi tiến trình tuyển sinh của các danh sách hàng chờ và kích hoạt mở lớp học trực tiếp.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Table section */}
      <div className="space-y-6">
        {loading && waitlists.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-semibold text-neutral-medium">
                Đang tải danh sách hàng chờ...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-white rounded-2xl border border-border-light/40 shadow-xs">
            <p className="text-sm text-danger mb-4">{error}</p>
            <Button onClick={fetchWaitlists} variant="outline" size="sm">Thử lại</Button>
          </div>
        ) : (
          <WaitlistTable
            waitlists={waitlists}
            onStartClass={handleStartClass}
            isLoading={loading}
            onRefresh={fetchWaitlists}
          />
        )}
      </div>
    </div>
  )
}
