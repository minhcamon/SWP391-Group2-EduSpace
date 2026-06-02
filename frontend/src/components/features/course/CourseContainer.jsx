import CourseItem from "./CourseItem";
import { Link } from "react-router";
import { MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import courseService from "@/services/courseService";
import { toast } from "sonner";

const CourseContainer = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getPublishedCourses();

                setCourses(data);
            } catch (error) {
                console.error(
                    "Lỗi fetch khóa học tại CourseContainer: ",
                    error,
                );
                toast.error("Lỗi khi tải khóa học");
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="container mx-auto px-4 my-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">Khóa học phổ biến</h1>
                <Link to="/courses">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-6 pb-2">
                {courses.slice(0, 4).map((course) => (
                    <CourseItem key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
};

export default CourseContainer;
