import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import PrimaryButton from "@/components/ui/PrimaryButton";

const CourseItem = ({ course }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-1.5">
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug hover:text-primary transition-colors cursor-pointer line-clamp-2 min-h-12">
                    {course.title}
                </h3>

                <div className="mb-4">
                    <Badge variant="secondary" className="py-2.5">
                        <span>
                            Tác giả: {course.creatorFullName}
                        </span>
                    </Badge>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                </p>
            </div>

            <div className="flex gap-4">
                <Button
                    variant="outline"
                    className="rounded-full py-6 px-12 hover:cursor-pointer hover:scale-95"
                >
                    Chi tiết
                </Button>
                <Button className="rounded-full p-6 hover:cursor-pointer hover:scale-95">
                    Đăng ký ngay
                </Button>
                {/* <button className="flex-1 bg-primary hover:bg-[#ea580c] text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors shadow-sm shadow-orange-500/10 cursor-pointer">
                    
                </button> */}
            </div>
        </div>
    );
};

export default CourseItem;
