export const mockCourses = [
  {
    id: 1,
    title: "Java Spring Boot",
    description: "Master enterprise-grade backend development with Spring Boot. Build scalable RESTful APIs, manage databases with Hibernate, and deploy robust microservices in this intensive pairing-based course.",
    duration: "6 tuần",
    level: "Intermediate",
    format: "Học theo cặp",
    currentStudents: 7,
    maxStudents: 10,
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    syllabus: [
      {
        id: 1,
        title: "Spring Core & DI",
        completedCount: 3,
        totalCount: 3,
        items: ["Inversion of Control (IoC)", "Dependency Injection Types", "Spring Beans & Scopes"]
      },
      {
        id: 2,
        title: "RESTful APIs with Spring Boot",
        completedCount: 1,
        totalCount: 4,
        items: ["Bootstrapping a Spring Boot App", "Building Controllers & Routing", "Exception Handling (@ControllerAdvice)", "Validation & DTOs"]
      },
      {
        id: 3,
        title: "Data Access & Hibernate",
        completedCount: 0,
        totalCount: 5,
        items: ["JPA & Hibernate Basics", "Spring Data JPA Repositories", "Query Methods & JPQL", "Entity Relationships", "Transaction Management"]
      }
    ]
  }
];

export const mockClasses = {
  1: {
    classId: "1",
    courseId: 1,
    courseTitle: "Java Spring Boot",
    cohortName: "Cohort #104",
    title: "Class Wall",
    subtitle: "Stay updated with Cohort #104's latest achievements and activities.",
    currentStudents: 8,
    maxStudents: 10,
    status: "WAITING", // Default, can be toggled to ACTIVE
    bannerMessage: "Lớp học đang được thiết lập (Hiện tại: 8/10 bạn). Hệ thống sẽ tự động ghép cặp ngay khi đủ người. Bạn không cần đợi ở đây, chúng tôi sẽ gửi một Email thông báo kèm link trực tiếp ngay khi lớp học sẵn sàng!",
    membersWaiting: [
      { id: 1, name: "An", initials: "AN", color: "bg-surface-container-high text-on-surface-variant" },
      { id: 2, name: "Tuấn Minh", initials: "TM", color: "bg-primary-container text-on-primary-container" },
      { id: 3, name: "John Doe", initials: "JD", color: "bg-secondary-container text-on-secondary-container" },
      { id: 4, name: "Khánh Lê", initials: "KL", color: "bg-tertiary-container text-on-tertiary-container" },
      { id: 5, name: "Mai Phương", initials: "MP", color: "bg-surface-container-highest text-on-surface-variant" },
      { id: 6, name: "Quốc Tuấn", initials: "QT", color: "bg-primary text-on-primary" },
      { id: 7, name: "Rose", initials: "RS", color: "bg-secondary text-on-secondary" },
      { id: 8, name: "Victor", initials: "VW", color: "bg-tertiary text-on-tertiary" }
    ],
    preCourseMaterials: [
      {
        id: 1,
        title: "Cấu trúc đề thi Listening",
        description: "Tổng quan các phần thi, dạng câu hỏi thường gặp và chiến thuật làm bài hiệu quả.",
        type: "document"
      },
      {
        id: 2,
        title: "Bộ từ vựng cốt lõi (PDF)",
        description: "Tài liệu tổng hợp 500+ từ vựng học thuật quan trọng nhất dành cho người mới bắt đầu.",
        type: "pdf"
      }
    ],
    activeFeed: [
      {
        id: 1,
        type: "achievement",
        title: "Thành tích xuất sắc Section 2",
        timeAgo: "2 giờ trước",
        content: "🎉 Chúc mừng Cặp đôi <strong class=\"text-primary\">Minh & An</strong> đã hoàn thành xuất sắc Section 2 với điểm số <strong class=\"text-secondary font-bold\">9/10</strong>!",
        reactions: [
          { emoji: "❤️", count: 24, userReacted: true },
          { emoji: "🔥", count: 8, userReacted: false },
          { emoji: "👏", count: 12, userReacted: false }
        ]
      },
      {
        id: 2,
        type: "material",
        title: "Tài liệu học tập mới",
        timeAgo: "5 giờ trước",
        content: "Hệ thống vừa cập nhật bộ tài liệu <strong class=\"text-neutral-dark font-medium italic\">\"Advanced IELTS Writing Strategies\"</strong> cho Cohort #104. Hãy kiểm tra Lesson Materials để bắt đầu ôn luyện.",
        reactions: [
          { emoji: "👍", count: 15, userReacted: false }
        ]
      },
      {
        id: 3,
        type: "reminder",
        title: "Nhắc nhở Pair Task",
        timeAgo: "1 ngày trước",
        content: "Nhắc nhở các cặp đôi: Hạn cuối nộp bài tập Discussion Task #4 là vào <strong class=\"text-danger font-bold\">20:00 tối nay</strong>. Đừng quên nộp bài đúng hạn nhé!",
        reactions: [
          { emoji: "⏰", count: 32, userReacted: false }
        ]
      }
    ],
    activePersonnel: [
      {
        id: 1,
        pairName: "Pair 01",
        status: "ACTIVE",
        student1: { name: "Minh", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" },
        student2: { name: "An", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" }
      },
      {
        id: 2,
        pairName: "Pair 02",
        status: "ACTIVE",
        student1: { name: "Tuấn", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
        student2: { name: "Lan", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" }
      },
      {
        id: 3,
        pairName: "Pair 03",
        status: "IN BREAK",
        student1: { name: "Kiên", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" },
        student2: { name: "Mai", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop" }
      },
      {
        id: 4,
        pairName: "Pair 04",
        status: "ACTIVE",
        student1: { name: "Đức", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop" },
        student2: { name: "Hoa", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop" }
      },
      {
        id: 5,
        pairName: "Pair 05",
        status: "ACTIVE",
        student1: { name: "Hoàng", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop" },
        student2: { name: "Linh", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop" }
      }
    ]
  }
};
