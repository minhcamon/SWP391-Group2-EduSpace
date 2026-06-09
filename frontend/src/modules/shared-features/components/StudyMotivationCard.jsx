import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

const StudyMotivationCard = () => {
    return (
        <Card className="bg-white border border-border-light/30 shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <CardHeader className="p-6 pb-0">
                <CardTitle className="text-sm font-bold text-neutral-dark uppercase tracking-wider border-b border-slate-100 pb-2">Phương châm học tập</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-3">
                <div className="flex gap-3 text-xs">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-neutral-medium">Học hỏi liên tục mỗi ngày.</span>
                </div>
                <div className="flex gap-3 text-xs">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-neutral-medium">Hoàn thành bài tập chấm từ Mentor.</span>
                </div>
                <div className="flex gap-3 text-xs">
                    <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                    <span className="text-neutral-medium">Tham gia cống hiến bài viết chất lượng trong cộng đồng học viên.</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default StudyMotivationCard;
