import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const IncidentHistoryLog = ({ history = [] }) => {
  return (
    <Card className="border border-border-light/35 shadow-sm">
      <CardHeader className="border-b border-border-light/20 pb-4">
        <CardTitle className="text-base font-bold text-neutral-dark">Lịch sử xử lý sự cố</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
          {history.map((hist) => (
            <div key={hist.id} className="relative">
              <span className="absolute left-[-31px] top-0 bg-slate-200 border-2 border-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-neutral-medium">
                {hist.id}
              </span>
              <p className="text-xs font-semibold text-neutral-medium">{hist.time}</p>
              <p className="font-bold text-neutral-dark text-sm mt-0.5">{hist.action}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentHistoryLog;
