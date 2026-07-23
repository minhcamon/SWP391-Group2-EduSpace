import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { MessageSquare } from "lucide-react";

const PairInterventionForm = ({ msgContent, setMsgContent, isSending, onSubmit }) => {
  return (
    <Card className="border border-border-light/35 shadow-sm bg-slate-50">
      <CardHeader>
        <CardTitle className="text-base font-bold text-neutral-dark">Hành động can thiệp (Intervention)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-medium mb-1.5 uppercase tracking-wide">
              Thông điệp gửi cặp đôi
            </label>
            <textarea
              rows={4}
              value={msgContent}
              onChange={(e) => setMsgContent(e.target.value)}
              placeholder="Nhập nội dung nhắc nhở, cảnh báo hoặc hỗ trợ..."
              className="w-full p-3 border border-border-light/65 rounded-xl text-sm focus:outline-none focus:border-primary bg-white resize-none"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-sm active:scale-98 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <MessageSquare size={14} />
            <span>{isSending ? "Đang gửi..." : "Gửi thông điệp"}</span>
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PairInterventionForm;
