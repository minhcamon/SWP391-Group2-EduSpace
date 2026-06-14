export const initialMessages = [
    {
        id: 1,
        sender: "Sarah",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        text: "Cậu xem phần này nhé, rất quan trọng để ghi chú đấy.",
        timestamp: "2:14 PM",
        isMe: false,
        videoTime: "02:15"
    },
    {
        id: 2,
        sender: "You",
        text: "Ok luôn! Mình đang note vào file tài liệu chung rồi.",
        timestamp: "2:15 PM",
        isMe: true
    }
];

export const initialNotes = "### Ghi chú bài học: Effective Active Listening\n\n- **Active Listening là gì?**\n  - Lắng nghe chủ động, không chỉ nghe từ ngữ mà cả ý định và cảm xúc của người nói.\n- **Các yếu tố cốt lõi:**\n  - Ngoon ngữ cơ thể (non-verbal cues).\n  - Phản hồi và đặt câu hỏi mở.\n  - Tránh phán xét hoặc ngắt lời.";

export const materialsList = [
    { id: 1, name: "Lecture_Slides_Module1.pdf", size: "2.4 MB" },
    { id: 2, name: "Active_Listening_CheatSheet.pdf", size: "850 KB" }
];

export const partnerData = {
    name: "Nguyễn Văn A",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    goal: "Full Stack Developer",
    status: "online"
};

export const courseProgress = {
    title: "Full Stack Web Development - Nâng cao",
    percent: 45,
    currentLesson: 3,
    totalLessons: 12
};

export const roadmapNodes = [
    {
        id: 1,
        step: 1,
        title: "Tổng quan về Kiến trúc Web",
        description: "Hiểu về mô hình Client-Server, giao thức HTTP và cấu trúc cơ bản của một ứng dụng web hiện đại.",
        status: "COMPLETED"
    },
    {
        id: 2,
        step: 2,
        title: "Thiết kế Cơ sở dữ liệu Relational",
        description: "Tìm hiểu các quy tắc chuẩn hóa dữ liệu, thiết kế sơ đồ thực thể mối quan hệ (ERD) và thực hành trên cơ sở dữ liệu PostgreSQL.",
        status: "COMPLETED"
    },
    {
        id: 3,
        step: 3,
        title: "Xây dựng API với Node.js & Express",
        description: "Tạo RESTful APIs, tìm hiểu và xử lý các middleware, định tuyến router và kết nối tương tác với Database.",
        status: "CURRENT",
        progress: 20
    },
    {
        id: 4,
        step: 4,
        title: "Xác thực & Phân quyền",
        description: "Sử dụng JWT, bảo mật OAuth2 và các phương thức bảo mật thông tin cơ bản cho ứng dụng web.",
        status: "LOCKED"
    },
    {
        id: 5,
        step: 5,
        title: "Frontend Framework: React Foundation",
        description: "Các khái niệm Components, State, Props và quản lý vòng đời (Lifecycle) trong React.",
        status: "PARTNER_CURRENT"
    },
    {
        id: 6,
        step: 6,
        title: "Tích hợp Frontend & Backend",
        description: "Kết nối truyền tải dữ liệu giữa client và server thông qua API, cấu hình CORS và quản lý state toàn cục.",
        status: "LOCKED"
    }
];

export const courseTitle = "Communication Fundamentals";

export const studyGroup = [
    {
        id: 1,
        name: "Sarah M.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        status: "online"
    },
    {
        id: 2,
        name: "BK",
        avatar: null,
        initials: "BK",
        status: "idle",
        bgColor: "bg-orange-100",
        textColor: "text-secondary"
    },
    {
        id: 3,
        name: "TL",
        avatar: null,
        initials: "TL",
        status: "offline",
        bgColor: "bg-slate-100",
        textColor: "text-neutral-medium"
    }
];

export const lessonDetails = {
    id: 1,
    module: "Module 1",
    title: "Effective Active Listening",
    duration: "15 phút",
    description: "Tìm hiểu các nguyên tắc cốt lõi của việc lắng nghe chủ động. Học cách nhận biết ngôn ngữ cơ thể và ý định của người nói để cải thiện khả năng giao tiếp và làm việc nhóm hiệu quả.",
    videoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    videoDuration: "15:30",
    videoProgressPercent: 15,
    videoCurrentTime: "02:15",
    isCompleted: false,
    partnerName: "Sarah M."
};

export const sidebarSections = [
    {
        id: 1,
        title: "Foundations",
        statusText: "Phần 1 • Đã Hoàn Thành",
        lessons: [
            {
                id: 101,
                title: "1. Course Intro",
                duration: "08:45",
                isCompleted: true,
                completedBy: ["Sarah", "Ben"]
            }
        ]
    },
    {
        id: 2,
        title: "Core Skills",
        statusText: "Phần 2 • Đang Học",
        lessons: [
            {
                id: 102,
                title: "2. Active Listening",
                duration: "15:30",
                isActive: true,
                partnerLearning: {
                    name: "Sarah M.",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
                }
            },
            {
                id: 103,
                title: "3. Non-verbal Cues",
                duration: "20:15",
                isLocked: true
            }
        ]
    }
];

