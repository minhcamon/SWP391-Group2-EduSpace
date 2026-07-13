import Button from "@/components/ui/Button";
import { useNavigate } from "react-router";

const EnrolledCourseCard = ({ course, onContinue }) => {
  const navigate = useNavigate();

  const isCompleted = course.isCompleted === true || course.completed === true || course.progressPercentage >= 100;

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md border border-border-light/40 overflow-hidden flex flex-col h-full group transition-all duration-300">
      <div className="p-6 grow flex flex-col justify-between">
        <div>
          {/* Title & Description */}
          <h4 className="text-lg font-bold text-neutral-dark mb-1 transition-colors duration-200">
            {course.courseName}
          </h4>
          <p className="text-xs font-semibold text-neutral-medium mb-6">
            {course.courseDescription}
          </p>
        </div>

        {/* Progress & Actions */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-neutral-medium">
              <span>Tiến độ</span>
              <span className={isCompleted ? "font-bold text-green-600" : "font-bold text-primary"}>
                {course.progressPercentage}%
              </span>
            </div>
            {/* Progress Bar Track */}
            <div className="w-full h-2 bg-slate-100 dark:bg-muted/55 rounded-full overflow-hidden">
              {/* Progress Fill */}
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${isCompleted ? "bg-green-500" : "bg-secondary"
                  }`}
                style={{
                  width: `${course.progressPercentage}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          {isCompleted ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/classes/${course.classId}/certificate`);
              }}
              variant="default"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200 active:scale-[0.98] py-2 h-auto"
            >
              🏆 Xem chứng chỉ
            </Button>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onContinue(course.courseId);
              }}
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all duration-200 active:scale-[0.98] py-2 h-auto"
            >
              Tiếp tục học
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
