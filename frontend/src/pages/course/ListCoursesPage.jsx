import CourseItem from "@/components/features/course/CourseItem";
import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import courseService from "@/services/courseService";
import { useEffect, useState } from "react";

const STATIC_COURSES_DB = [
    {
        id: 1,
        title: "Lập trình Java Web với Spring Boot nâng cao",
        status: "PUBLISHED",
        creator_id: 101,
        description:
            "Khóa học chuyên sâu về hệ sinh thái Spring: Spring Boot, Spring Security, JPA. Thực hành xây dựng Restful API theo kiến trúc phân tầng chuẩn dự án thực tế.",
        created_at: "2026-05-20T09:00:00Z",
    },
    {
        id: 2,
        title: "Cấu trúc dữ liệu & Giải thuật ứng dụng",
        status: "DRAFT",
        creator_id: 102,
        description:
            "Nắm vững bản chất của Array, Linked List, Stack, Queue, Tree, Graph và các thuật toán tối ưu hóa mã nguồn, chuẩn bị nền tảng phỏng vấn Big Tech.",
        created_at: "2026-05-25T14:30:00Z",
    },
    {
        id: 3,
        title: "Thiết kế kiến trúc hệ thống ứng dụng vi dịch vụ (Microservices)",
        status: "PUBLISHED",
        creator_id: 101,
        description:
            "Học cách chia nhỏ hệ thống Monolith thành các service độc lập. Triển khai API Gateway, Service Discovery, Event-Driven Architecture với Kafka và Docker.",
        created_at: "2026-05-28T10:15:00Z",
    },
    {
        id: 4,
        title: "Xây dựng ứng dụng Frontend với ReactJS & Tailwind",
        status: "ARCHIVED",
        creator_id: 103,
        description:
            "Làm chủ Component Lifecycle, React Hooks, State Management (Redux/Zustand) và xây dựng giao diện thô/responsive cực nhanh với hệ thống utility-first của Tailwind CSS.",
        created_at: "2026-05-18T16:00:00Z",
    },
    {
        id: 5,
        title: "Thiết kế kiến trúc hệ thống ứng dụng vi dịch vụ (Microservices)",
        status: "PUBLISHED",
        creator_id: 101,
        description:
            "Học cách chia nhỏ hệ thống Monolith thành các service độc lập. Triển khai API Gateway, Service Discovery, Event-Driven Architecture với Kafka và Docker.",
        created_at: "2026-05-28T10:15:00Z",
    },
    {
        id: 6,
        title: "Thiết kế kiến trúc hệ thống ứng dụng vi dịch vụ (Microservices)",
        status: "PUBLISHED",
        creator_id: 101,
        description:
            "Học cách chia nhỏ hệ thống Monolith thành các service độc lập. Triển khai API Gateway, Service Discovery, Event-Driven Architecture với Kafka và Docker.",
        created_at: "2026-05-28T10:15:00Z",
    },
    {
        id: 7,
        title: "Thiết kế kiến trúc hệ thống ứng dụng vi dịch vụ (Microservices)",
        status: "PUBLISHED",
        creator_id: 101,
        description:
            "Học cách chia nhỏ hệ thống Monolith thành các service độc lập. Triển khai API Gateway, Service Discovery, Event-Driven Architecture với Kafka và Docker.",
        created_at: "2026-05-28T10:15:00Z",
    },
];

const ListCoursesPage = () => {
    const [courses, setCourses] = useState([]);

    // useEffect(() => {
    //     const fetchCourses = async () => {
    //         try {
    //             const data = await courseService.getPublishedCourses();
    //             setCourses(data);
    //         } catch (error) {
    //             console.error("Lỗi fetch khóa học: ", error);
    //             toast.error("Lỗi khi tải khóa học");
    //         }
    //     };

    //     fetchCourses();
    // }, []);

    const displayApprovedCourses = STATIC_COURSES_DB.filter(
        (course) => course.status === "PUBLISHED",
    );

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col">
            <Header />

            <main className="w-full mx-auto px-4 py-12 grow">
                <div className="text-center md:text-left mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
                        Khám phá các khóa học tại{" "}
                        <span className="text-primary">Edu<span className="text-tertiary">Space</span></span>
                    </h2>
                    <p className="text-gray-600 font-medium text-base max-w-2xl">
                        Học tập theo mô hình lớp học 10 người — Ghép cặp tương
                        tác cùng tiến bộ.
                    </p>
                </div>

                <hr className="border-gray-200 mb-10" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayApprovedCourses.map((course) => (
                        <CourseItem key={course.id} courseItem={course} />
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ListCoursesPage;
