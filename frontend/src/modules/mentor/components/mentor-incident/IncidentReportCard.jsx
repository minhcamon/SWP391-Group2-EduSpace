import React from 'react'
import { User, Paperclip } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

const IncidentReportCard = ({ incident }) => {
  if (!incident) return null

  return (
    <Card className="border border-border-light/35 shadow-sm">
      <CardHeader className="border-b border-border-light/20 pb-4">
        <CardTitle className="text-base font-bold text-neutral-dark">
          Chi tiết nội dung báo cáo
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-b border-slate-100 pb-4">
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-medium font-semibold">
              Người gửi báo cáo
            </p>
            <p className="font-bold text-neutral-dark flex items-center gap-1">
              <User
                size={14}
                className="text-slate-400"
              />
              {incident.reporterName}
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-neutral-medium font-semibold">
              Đối tượng bị báo cáo
            </p>
            <p className="font-bold text-neutral-dark flex items-center gap-1">
              <User
                size={14}
                className="text-slate-400"
              />
              {incident.reportedName || 'Hệ thống / Không có'}
            </p>
          </div>
        </div>

        {/* Reason Description */}
        <div className="space-y-2">
          <p className="text-xs text-neutral-medium font-bold uppercase tracking-wider">
            Lý do báo cáo
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-neutral-dark leading-relaxed font-semibold">
            {incident.reason}
          </div>
        </div>

        {/* Evidence attachments */}
        {/* {incident.evidenceUrl && (
          <div className="space-y-2 pt-2">
            <p className="text-xs text-neutral-medium font-bold uppercase tracking-wider">Tệp bằng chứng kèm theo</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={incident.evidenceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white border border-border-light/50 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary hover:bg-slate-50 cursor-pointer shadow-sm"
              >
                <Paperclip size={13} />
                <span>Xem tệp bằng chứng</span>
              </a>
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  )
}

export default IncidentReportCard
