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
import EmptyState from "@/components/ui/EmptyState";
import { Inbox } from "lucide-react";
import { useSearchParams } from "react-router";

const ListCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getPublishedCourses();
                setCourses(data);
            } catch (error) {
                console.error("Lỗi fetch khóa học tại ListCoursesPage: ", error);
                toast.error("Lỗi khi tải khóa học");
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) => {
        const query = search.toLowerCase().trim();
        if (!query) return true;
        return (
            (course.title && course.title.toLowerCase().includes(query)) ||
            (course.description && course.description.toLowerCase().includes(query))
        );
    });

    const getCourseLength = filteredCourses.length;

    return (
        <main className="w-full mx-auto px-4 grow container">
            <Card className="p-6 bg-white border border-gray-200 shadow-sm">
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
                {search ? (
                    <>
                        Kết quả tìm kiếm cho "
                        <strong className="text-primary">{search}</strong>
                        ": Có{" "}
                    </>
                ) : (
                    "Hiện tại đang có "
                )}
                <strong className="text-secondary">{getCourseLength}</strong>{" "}
                khóa học
            </div>

            {filteredCourses.length == 0 ? (
                <div className="mt-4 pb-2">
                    <EmptyState icon={Inbox}>
                        {search
                            ? "Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn"
                            : "Hiện tại chưa có khóa học nào"}
                    </EmptyState>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                    {filteredCourses.map((course) => (
                        <CourseItem key={course.id} course={course} />
                    ))}
                </div>
            )}
        </main>
    );
};

export default ListCoursesPage;
