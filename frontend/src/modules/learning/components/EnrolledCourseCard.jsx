import React from "react";
import { Code, Settings, BookOpen } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

const iconMap = {
  code: Code,
  settings_input_component: Settings,
};

const EnrolledCourseCard = ({ course, onContinue }) => {
  //   const IconComponent = iconMap[course.icon] || BookOpen;

  return (
    <div className="bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md border border-border-light/40 overflow-hidden flex flex-col h-full group transition-all duration-300">
      <div className="p-6 grow flex flex-col justify-between">
        <div>
          {/* Header: Category & Icon */}
          {/* <div className="flex justify-between items-start mb-4">
                        <Badge
                            variant="outline"
                            className="bg-slate-50 dark:bg-muted/30 border-border-light/35 font-semibold"
                        >
                            {course.category}
                        </Badge>
                        <div className="text-neutral-light group-hover:text-primary transition-colors duration-200">
                            <IconComponent size={20} />
                        </div>
                    </div> */}

          {/* Title & Description */}
          <h4 className="text-lg font-bold text-neutral-dark mb-1 group-hover:text-primary transition-colors duration-200">
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
              <span className="font-bold text-primary">
                {course.progressPercentage}%
              </span>
            </div>
            {/* Progress Bar Track */}
            <div className="w-full h-2 bg-slate-100 dark:bg-muted/55 rounded-full overflow-hidden">
              {/* Progress Fill (Uses secondary accent color F28020) */}
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${course.progressPercentage}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onContinue(course.id)}
            variant="outline"
            className="w-full border-primary text-primary hover:bg-primary hover:text-white font-semibold transition-all duration-200 active:scale-[0.98] py-2 h-auto"
          >
            Tiếp tục học
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrolledCourseCard;
