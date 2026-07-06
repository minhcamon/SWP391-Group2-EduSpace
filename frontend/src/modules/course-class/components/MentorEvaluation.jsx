import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router";

export const MentorEvaluation = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  
  const resolvedClassId = classId || "104";

  const handleNavigateToAssignment = () => {
    navigate(`/classes/${resolvedClassId}/assignments/writing-task-2`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Grading Card 1 */}
      <article className="bg-white p-6 rounded-2xl border border-border-light/35 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider">
              Milestone 2
            </span>
            <h3 className="text-base font-bold text-neutral-dark mt-1">
              Bài làm: Speaking Mock Test 1
            </h3>
            <p className="text-xs text-neutral-medium mt-0.5">
              Cặp đôi: Hoàng Nam &amp; Lan Anh
            </p>
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handleNavigateToAssignment}
              className="p-1.5 text-primary hover:bg-primary/5 rounded-full transition-colors cursor-pointer"
              title="Xem trước bài làm"
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-bg-base/60 p-4 rounded-xl border-l-4 border-primary text-xs leading-relaxed text-neutral-medium italic">
          "Chúng em đã hoàn thành phần ghi âm đối thoại và tóm tắt ý chính của bài đọc. Nhờ Mentor xem xét kỹ phần ngữ điệu và phát âm âm đuôi..."
        </div>

        <div className="flex flex-col gap-3">
          <textarea
            className="w-full bg-bg-base/40 border border-border-light/40 rounded-xl p-3 text-xs focus:ring-1 focus:ring-primary outline-hidden text-neutral-dark"
            placeholder="Nhập nhận xét chi tiết hoặc phản hồi nhanh cho học viên..."
            rows="2"
          />
          <div className="flex gap-3">
            <Button
              onClick={() => toast.success("Đã thông qua bài làm!")}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
            >
              Thông qua
            </Button>
            <Button
              onClick={() => toast.warning("Đã gửi yêu cầu chỉnh sửa lại bài tập.")}
              variant="outline"
              className="flex-1 py-3 border-border-light text-neutral-medium font-semibold text-xs cursor-pointer"
            >
              Cần sửa lại
            </Button>
          </div>
        </div>
      </article>

      {/* Grading Card 2 (Pending/Inactive preview) */}
      <article className="bg-white/60 p-5 rounded-2xl border border-border-light/35 shadow-sm flex items-center justify-between text-xs">
        <p className="font-bold text-neutral-medium">
          Đợi duyệt: Writing Task 2 Prep - Cặp đôi Minh Quân &amp; Thùy Chi
        </p>
        <button 
          onClick={handleNavigateToAssignment}
          className="text-primary font-bold hover:underline cursor-pointer"
        >
          Xem chi tiết
        </button>
      </article>
    </div>
  );
};

export default MentorEvaluation;
