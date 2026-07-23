import React from "react";
import { Users } from "lucide-react";
import Button from "@/components/ui/Button";

const AvailableCourseCard = ({ course, onJoin }) => {
    return (
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm hover:shadow-md border border-border-light/40 overflow-hidden flex flex-col h-full group transition-all duration-300">
            {/* Course Image Header */}
            <div className="h-32 bg-slate-100 overflow-hidden relative">
                <img
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={course.image}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Course Content */}
            <div className="p-6 grow flex flex-col justify-between">
                <div>
                    <h4 className="text-lg font-bold text-neutral-dark mb-1 group-hover:text-primary transition-colors duration-200">
                        {course.title}
                    </h4>
                    <p className="text-sm text-neutral-medium mb-6 line-clamp-2">
                        {course.description}
                    </p>
                </div>

                {/* Footer and CTA */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-neutral-medium font-semibold text-xs">
                        <Users size={16} className="text-neutral-light" />
                        <span>{course.studentCount} học viên</span>
                    </div>

                    <Button
                        onClick={() => onJoin(course.id, course.title)}
                        variant="default"
                        className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-2.5 h-auto transition-all duration-200 active:scale-[0.98]"
                    >
                        Tham gia Cohort
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AvailableCourseCard;
