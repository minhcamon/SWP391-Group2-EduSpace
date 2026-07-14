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
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router";
import { Button } from "@/components/ui/Button";

const ListCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const pageSize = 6;

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await courseService.getPublishedCourses(currentPage, pageSize);
                setCourses(data.content || []);
                setTotalPages(data.totalPages || 0);
                setTotalElements(data.totalElements || 0);
            } catch (error) {
                console.error("Lỗi fetch khóa học tại ListCoursesPage: ", error);
                toast.error("Lỗi khi tải khóa học");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [currentPage]);

    const filteredCourses = courses.filter((course) => {
        const query = search.toLowerCase().trim();
        if (!query) return true;
        return (
            (course.title && course.title.toLowerCase().includes(query)) ||
            (course.description && course.description.toLowerCase().includes(query))
        );
    });

    const getCourseLength = search ? filteredCourses.length : totalElements;

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

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

            {loading ? (
                <div className="flex justify-center items-center mt-10 pb-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : filteredCourses.length === 0 ? (
                <div className="mt-4 pb-2">
                    <EmptyState icon={Inbox}>
                        {search
                            ? "Không tìm thấy khóa học nào phù hợp với tìm kiếm của bạn"
                            : "Hiện tại chưa có khóa học nào"}
                    </EmptyState>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                        {filteredCourses.map((course) => (
                            <CourseItem key={course.id} course={course} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {!search && totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="flex items-center gap-1"
                            >
                                <ChevronLeft size={16} />
                                Trước
                            </Button>

                            <div className="flex items-center gap-2">
                                {[...Array(totalPages)].map((_, index) => (
                                    <Button
                                        key={index}
                                        variant={currentPage === index ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(index)}
                                        className="min-w-[40px]"
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages - 1}
                                className="flex items-center gap-1"
                            >
                                Sau
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </main>
    );
};

export default ListCoursesPage;
