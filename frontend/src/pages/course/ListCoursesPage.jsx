import CardInformation from "@/components/ui/CardInformation";
import CourseItem from "@/components/features/course/CourseItem";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
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
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <Header />

            <main className="w-full mx-auto px-4 py-12 grow container">
                <CardInformation description="Học tập theo mô hình lớp học 10 người — Ghép cặp tương tác, cùng nhau tiến bộ vượt bậc.">
                    Khám phá các khóa học tại{" "}
                    <span className="text-primary">Edu</span>
                    <span className="text-tertiary">Space</span>
                </CardInformation>

                <div className="mt-5">
                    Hiện tại đang có <strong className="text-secondary">{getCourseLength}</strong> khóa
                    học
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
                    {courses.map((course) => (
                        <CourseItem key={course.id} course={course} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ListCoursesPage;
