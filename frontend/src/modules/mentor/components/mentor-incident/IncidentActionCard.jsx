import React from "react";
import { ShieldAlert, Play, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

const RegradeForm = ({ incident, isSubmitting, handleResolve, handleReject }) => {
  const [criteriaList, setCriteriaList] = React.useState(
    incident.rubricCriteria?.map(c => ({
      criteriaName: c.criteriaName,
      maxPoint: c.maxPoint,
      score: c.score !== null ? c.score : 0,
      description: c.description
    })) || []
  );
  const [note, setNote] = React.useState("");
  const [isRejectMode, setIsRejectMode] = React.useState(false);

  const handleScoreChange = (index, value) => {
    const newScore = Math.max(0, Math.min(criteriaList[index].maxPoint, Number(value) || 0));
    setCriteriaList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], score: newScore };
      return next;
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    if (isRejectMode) {
      handleReject({ resolutionNote: note.trim() });
    } else {
      handleResolve({
        resolutionNote: note.trim(),
        criteriaScores: criteriaList
      });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between border-b border-border-light/20 pb-2 mb-2">
        <span className="text-xs font-bold text-neutral-medium uppercase tracking-wide">
          {isRejectMode ? "Từ chối phân xử" : "Đánh giá lại bài nộp"}
        </span>
        <button
          type="button"
          onClick={() => {
            setIsRejectMode(!isRejectMode);
            setNote("");
          }}
          className="text-xs text-primary hover:underline font-bold"
        >
          {isRejectMode ? "Chuyển sang chấm điểm" : "Chuyển sang từ chối"}
        </button>
      </div>

      {!isRejectMode && (
        <div className="space-y-3">
          {criteriaList.map((crit, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex-1">
                <p className="font-bold text-neutral-dark text-xs">{crit.criteriaName}</p>
                <p className="text-[10px] text-neutral-medium">Tối đa: {crit.maxPoint} đ</p>
              </div>
              <input
                type="number"
                min="0"
                max={crit.maxPoint}
                value={crit.score}
                onChange={(e) => handleScoreChange(idx, e.target.value)}
                className="w-16 p-1.5 border border-border-light text-center rounded-lg text-xs font-bold focus:outline-none focus:border-primary bg-white"
              />
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold text-neutral-medium mb-1 uppercase tracking-wide">
          {isRejectMode ? "Lý do từ chối phân xử" : "Nhận xét của Mentor"}
        </label>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={isRejectMode ? "Mô tả chi tiết lý do từ chối xử lý sự cố này..." : "Lý do thay đổi điểm số, nhận xét về bài nộp của học viên..."}
          className="w-full p-3 border border-border-light rounded-xl text-xs focus:outline-none focus:border-primary resize-none bg-white font-semibold"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !note.trim()}
        className={`w-full text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer ${
          isRejectMode ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        <span>
          {isSubmitting
            ? "Đang xử lý..."
            : isRejectMode
            ? "Xác nhận từ chối"
            : "Hoàn tất & Cập nhật điểm"}
        </span>
      </button>
    </form>
  );
};

const GeneralActionForm = ({ isSubmitting, handleResolve, handleWarn }) => {
  const [note, setNote] = React.useState("");
  const [actionType, setActionType] = React.useState("RESOLVE"); // RESOLVE or WARN

  const onSubmit = (e) => {
    e.preventDefault();
    if (!note.trim()) return;

    if (actionType === "RESOLVE") {
      handleResolve({ resolutionNote: note.trim() });
    } else {
      handleWarn({ resolutionNote: note.trim() });
      setNote("");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={() => setActionType("RESOLVE")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            actionType === "RESOLVE" ? "bg-white text-neutral-dark shadow-xs" : "text-neutral-medium hover:text-neutral-dark"
          }`}
        >
          Giải quyết & Đóng
        </button>
        <button
          type="button"
          onClick={() => setActionType("WARN")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
            actionType === "WARN" ? "bg-white text-neutral-dark shadow-xs" : "text-neutral-medium hover:text-neutral-dark"
          }`}
        >
          Nhắc nhở học viên
        </button>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-neutral-medium mb-1 uppercase tracking-wide">
          {actionType === "RESOLVE" ? "Phương án giải quyết sự cố" : "Nội dung nhắc nhở / Cảnh cáo"}
        </label>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={
            actionType === "RESOLVE"
              ? "Ghi chú kết luận cách xử lý, giải quyết mâu thuẫn/lỗi..."
              : "Nội dung cảnh báo gửi đến học viên liên quan (Sự cố vẫn giữ mở)..."
          }
          className="w-full p-3 border border-border-light rounded-xl text-xs focus:outline-none focus:border-primary resize-none bg-white font-semibold"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !note.trim()}
        className={`w-full text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer ${
          actionType === "RESOLVE" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-500 hover:bg-amber-600"
        }`}
      >
        <span>
          {isSubmitting
            ? "Đang gửi..."
            : actionType === "RESOLVE"
            ? "Giải quyết & Đóng sự cố"
            : "Gửi nhắc nhở"}
        </span>
      </button>
    </form>
  );
};

const IncidentActionCard = ({
  incident,
  isSubmitting,
  handleClaim,
  handleResolve,
  handleReject,
  handleWarn
}) => {
  if (!incident) return null;

  if (incident.status === "PENDING") {
    return (
      <Card className="border border-primary/20 bg-primary/5 text-center p-6">
        <ShieldAlert className="mx-auto text-primary mb-3" size={32} />
        <h4 className="font-bold text-neutral-dark text-base mb-1">Sự cố đang Chờ xử lý</h4>
        <p className="text-xs text-neutral-medium mb-4 leading-relaxed">
          Nhận xử lý sự cố để chuyển trạng thái sang Đang hoạt động và bắt đầu can thiệp giải quyết.
        </p>
        <button
          onClick={handleClaim}
          disabled={isSubmitting}
          className="w-full bg-primary text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary/95 transition-all shadow-sm active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Play size={14} />
          <span>{isSubmitting ? "Đang xử lý..." : "Tiếp nhận giải quyết"}</span>
        </button>
      </Card>
    );
  }

  if (incident.status === "IN_PROGRESS") {
    return (
      <Card className="border border-border-light/35 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-base font-bold text-neutral-dark">Phương án xử lý</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {incident.incidentType === "ASSIGNMENT_DISPUTE" ? (
            <RegradeForm
              incident={incident}
              isSubmitting={isSubmitting}
              handleResolve={handleResolve}
              handleReject={handleReject}
            />
          ) : (
            <GeneralActionForm
              isSubmitting={isSubmitting}
              handleResolve={handleResolve}
              handleWarn={handleWarn}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  if (incident.status === "RESOLVED") {
    return (
      <Card className="border border-emerald-200 bg-emerald-50 text-emerald-950 p-5 shadow-sm">
        <div className="flex gap-2">
          <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-bold text-sm text-emerald-800">Sự cố đã được giải quyết</h4>
            {incident.resolutionNote && (
              <div className="text-xs text-emerald-700 mt-2 italic font-semibold whitespace-pre-wrap">
                "{incident.resolutionNote}"
              </div>
            )}
            {incident.resolvedByName && (
              <div className="text-[10px] text-neutral-medium mt-1 font-bold">
                Bởi: {incident.resolvedByName}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (incident.status === "REJECTED") {
    return (
      <Card className="border border-red-200 bg-red-50 text-red-950 p-5 shadow-sm">
        <div className="flex gap-2">
          <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-bold text-sm text-red-800">Yêu cầu phân xử bị từ chối</h4>
            {incident.resolutionNote && (
              <div className="text-xs text-red-700 mt-2 italic font-semibold whitespace-pre-wrap">
                "{incident.resolutionNote}"
              </div>
            )}
            {incident.resolvedByName && (
              <div className="text-[10px] text-neutral-medium mt-1 font-bold">
                Bởi: {incident.resolvedByName}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return null;
};

export default IncidentActionCard;
