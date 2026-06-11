import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import CourseItem from "../components/CourseItem";
import courseService from "@/services/courseService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ListCoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await courseService.getPublishedCourses();
            setCourses(data);
        } catch (error) {
            console.error("Lỗi fetch khóa học tại ListCoursesPage: ", error);
            toast.error("Lỗi khi tải khóa học");
        }
    };

    const getCourseLength = courses.length;

    return (
        <main className="w-full mx-auto px-4 py-12 grow container">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm ">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">
                        Khám phá các khóa học tại{" "}
                        <span className="text-primary">Edu</span>
                        <span className="text-tertiary">Space</span>
                    </CardTitle>
                    <CardDescription>
                        Học tập theo mô hình lớp học 10 người — Ghép cặp tương
                        tác, cùng nhau tiến bộ vượt bậc
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="mt-5">
                Hiện tại đang có{" "}
                <strong className="text-secondary">{getCourseLength}</strong>{" "}
                khóa học
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {courses.map((course) => (
                    <CourseItem key={course.id} course={course} />
                ))}
            </div>
        </main>
    );
};

export default ListCoursesPage;
