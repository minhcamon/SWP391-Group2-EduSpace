import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Award, MessageSquare, ShieldAlert } from "lucide-react";

const PairActivityHistory = ({ status }) => {
  return (
    <Card className="border border-border-light/35 shadow-sm">
      <CardHeader className="border-b border-border-light/20 pb-4">
        <CardTitle className="text-base font-bold text-neutral-dark">Lịch sử tương tác gần nhất</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative border-l-2 border-slate-100 pl-6 space-y-6">
          <div className="relative">
            <span className="absolute left-[-31px] top-0 bg-primary text-white p-1 rounded-full">
              <Award size={10} />
            </span>
            <p className="text-xs font-semibold text-neutral-medium">Hôm qua</p>
            <h4 className="font-bold text-neutral-dark text-sm mt-0.5">Hoàn thành Milestone 1</h4>
            <p className="text-xs text-neutral-medium mt-0.5">Cả hai đã nộp bài tập chấm chéo Milestone 1 và hoàn tất cho điểm nhau.</p>
          </div>

          <div className="relative">
            <span className="absolute left-[-31px] top-0 bg-amber-500 text-white p-1 rounded-full">
              <MessageSquare size={10} />
            </span>
            <p className="text-xs font-semibold text-neutral-medium">3 ngày trước</p>
            <h4 className="font-bold text-neutral-dark text-sm mt-0.5">Thảo luận bài tập nhóm</h4>
            <p className="text-xs text-neutral-medium mt-0.5">Học viên A nhắn tin nhắc học viên B hoàn thiện phần mở bài IELTS Writing.</p>
          </div>

          {status === "SLOW" && (
            <div className="relative">
              <span className="absolute left-[-31px] top-0 bg-red-500 text-white p-1 rounded-full">
                <ShieldAlert size={10} />
              </span>
              <p className="text-xs font-semibold text-neutral-medium">3 ngày trước</p>
              <h4 className="font-bold text-red-600 text-sm mt-0.5">Cảnh báo vắng mặt tự động</h4>
              <p className="text-xs text-neutral-medium mt-0.5">Học viên B không đăng nhập vào hệ thống học tập quá 72 giờ.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PairActivityHistory;
