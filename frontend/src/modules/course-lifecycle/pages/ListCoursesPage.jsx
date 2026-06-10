import CourseItem from "../components/CourseItem";
import CardInformationComponent from "@/components/ui/CardInformation";
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
        <main>
            <CardInformationComponent description="Học tập theo mô hình lớp học 10 người — Ghép cặp tương tác, cùng nhau tiến bộ vượt bậc.">
                Khám phá các khóa học tại{" "}
                <span className="text-primary">Edu</span>
                <span className="text-tertiary">Space</span>
            </CardInformationComponent>

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
