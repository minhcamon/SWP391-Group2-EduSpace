import CourseItem from "./CourseItem";
import { Link } from "react-router";
import { MoveRight } from "lucide-react";

const CourseContainer = () => {
    return (
        <div className="container mx-auto px-4 my-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Khóa học phổ biến</h1>
                <Link to="/roadmaps">
                    <div className="flex hover:opacity-80">
                        <span className="text-primary font-semibold">
                            Xem tất cả
                        </span>
                        <MoveRight
                            className="flex my-auto ml-2 mt-1.5 text-primary"
                            size={16}
                        ></MoveRight>
                    </div>
                </Link>
            </div>
            <div className="flex mt-4 gap-6 pb-2">
                <CourseItem actionText="Bắt đầu ngay" />
                <CourseItem actionText="Bắt đầu ngay" />
                <CourseItem actionText="Bắt đầu ngay" />
                <CourseItem actionText="Bắt đầu ngay" />
            </div>
        </div>
    );
};

export default CourseContainer;
