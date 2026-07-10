import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const IncidentDisputeCard = ({ incident }) => {
  if (!incident || incident.type !== "PEER_REVIEW_DISPUTE") return null;

  return (
    <Card className="border border-border-light/35 shadow-sm">
      <CardHeader className="border-b border-border-light/20 pb-4">
        <CardTitle className="text-base font-bold text-neutral-dark">Chi tiết chấm chéo bài nộp</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4 text-sm">
        <div>
          <h4 className="font-bold text-neutral-dark mb-1">{incident.submissionTitle}</h4>
          <p className="text-xs text-neutral-medium font-semibold">
            Điểm số nhận được từ bạn học:{" "}
            <span className="font-extrabold text-red-500">{incident.scoreGiven}</span>
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed text-neutral-dark">
          {incident.submissionContent}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentDisputeCard;
