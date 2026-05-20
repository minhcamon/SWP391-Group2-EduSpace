import { Users } from "lucide-react";
import SecondaryButton from "@/components/UI/SecondaryButton";
const CourseItem = () => {
    return (
        <div className="flex flex-col justify-between shadow-sm flex-1 min-w-200px max-w-300px bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all overflow-hidden">
            <div className="p-5 flex flex-col">
                <h3 className="text-xl font-bold text-neutral mb-1 leading-relaxed min-h-56px leading-snug">
                    IELTS Foundation 0 - 3.0
                </h3>
                <p className="text-gray-500 text-md mb-4 leading-relaxed">
                    Build a solid base
                </p>
            </div>
            <div className="flex items-center gap-1.5 text-neutral text-sm mt-auto p-5">
                <Users className="text-gray-700" size={16}></Users>
                <span className="font-medium">1000 học viên</span>
            </div>

            <div className="mb-6 w-3xs mx-auto">
                <SecondaryButton buttonText="Enroll" />
            </div>
        </div>
    );
};

export default CourseItem;
