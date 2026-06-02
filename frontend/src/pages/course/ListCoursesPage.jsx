import CourseItem from "@/components/features/course/CourseItem";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import courseService from "@/services/courseService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ListCoursesPage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllPublishedCourses();
                setCourses(data);
            } catch (error) {
                console.error(
                    "Lỗi fetch khóa học tại ListCoursesPage: ",
                    error,
                );
                toast.error("Lỗi khi tải khóa học");
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <Header />

            <main className="w-full mx-auto px-4 py-12 grow container">
                <div className="text-center md:text-left mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Khám phá các khóa học tại{" "}
                        <span className="text-primary">
                            Edu<span className="text-tertiary">Space</span>
                        </span>
                    </h2>
                    <p className="text-gray-600 font-medium text-base max-w-2xl">
                        Học tập theo mô hình lớp học 10 người — Ghép cặp tương
                        tác cùng tiến bộ.
                    </p>
                </div>

                <hr className="border-gray-200 mb-10" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
