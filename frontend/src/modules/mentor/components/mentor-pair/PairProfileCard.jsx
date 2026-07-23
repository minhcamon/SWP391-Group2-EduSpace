import { Card, CardContent } from "@/components/ui/Card";
import Avatar from "@/components/common/Avatar";

const PairProfileCard = ({ student, roleLabel }) => {
  if (!student) return null;

  return (
    <Card className="border border-border-light/35 shadow-sm">
      <CardContent className="p-6 text-center">
        <Avatar
          src={student.avatarUrl || student.avatar}
          alt={student.name}
          className="w-20 h-20 mx-auto border-2 border-primary/20 mb-4 bg-slate-100 shadow-sm"
        />
        <h3 className="font-bold text-neutral-dark text-lg">{student.name}</h3>
        <p className="text-xs text-neutral-light font-semibold mb-3">{roleLabel}</p>
        {/* Commented out as requested
        <div className="text-xs text-left bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
          <div className="flex justify-between">
            <span className="text-neutral-medium">Hoạt động cuối:</span>
            <span className="font-semibold text-neutral-dark">{lastActive}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-medium">Số bài đánh giá chéo:</span>
            <span className="font-semibold text-neutral-dark">{peerReviewCount}</span>
          </div>
        </div>
        */}
      </CardContent>
    </Card>
  );
};

export default PairProfileCard;
