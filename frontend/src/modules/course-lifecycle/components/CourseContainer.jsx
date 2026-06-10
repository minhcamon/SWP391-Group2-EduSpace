import CourseItem from "./CourseItem";
import { Link } from "react-router";
import { Inbox, MoveRight } from "lucide-react";
import { useEffect, useState } from "react";
import courseService from "@/services/courseService";
import { toast } from "sonner";
import EmptyState from "@/components/ui/EmptyState";

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
        <div>
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Khóa học phổ biến</h1>
                <Link to="/courses">
                    <div className="flex hover:opacity-80 transform transition-all duration-300 hover:-translate-y-1.5">
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

            {courses.length == 0 ? (
                <div className="mt-4 pb-2">
                    <EmptyState icon={Inbox}>
                        Hiện tại chưa có khóa học nào
                    </EmptyState>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 3).map((course) => (
                        <CourseItem key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseContainer;
