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
        status: "online",
        email: "sarah.m@eduspace.com",
        goal: "IELTS 7.5 - Speaking & Listening focus",
        bio: "Đam mê học tiếng Anh giao tiếp và thảo luận nhóm. Rất vui được học tập và rèn luyện cùng các bạn để đạt mục tiêu!",
        currentLesson: "2. Effective Active Listening"
    },
    {
        id: 2,
        name: "BK",
        avatar: null,
        initials: "BK",
        status: "idle",
        bgColor: "bg-orange-100",
        textColor: "text-secondary",
        email: "bk.nguyen@eduspace.com",
        goal: "IELTS 8.0 - Academic Writing focus",
        bio: "Thích viết luận tiếng Anh, phân tích cấu trúc ngữ pháp. Thường trực tuyến vào các buổi tối để cùng chữa bài.",
        currentLesson: "3. Non-verbal Cues"
    },
    {
        id: 3,
        name: "TL",
        avatar: null,
        initials: "TL",
        status: "offline",
        bgColor: "bg-slate-100",
        textColor: "text-neutral-medium",
        email: "tl.tran@eduspace.com",
        goal: "IELTS 6.5 - General English Improvement",
        bio: "Đang cải thiện khả năng phát âm và phản xạ nói. Rất thích các chủ đề bài học thực tế, mong muốn được giao lưu.",
        currentLesson: "1. Course Intro"
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
        title: "Module 1: Foundations of Communication",
        statusText: "Module 1 • Đã Hoàn Thành",
        status: "COMPLETED",
        lessons: [
            {
                id: 101,
                title: "1. Course Intro",
                duration: "08:45",
                isCompleted: true,
                completedBy: ["Sarah", "Ben"],
                currentPartners: [
                    {
                        name: "TL",
                        initials: "TL",
                        avatar: null,
                        bgColor: "bg-slate-100",
                        textColor: "text-neutral-medium",
                        status: "offline"
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Module 2: Core Listening Skills",
        statusText: "Module 2 • Đang Học",
        status: "IN_PROGRESS",
        lessons: [
            {
                id: 102,
                title: "2. Active Listening",
                duration: "15:30",
                isActive: true,
                currentPartners: [
                    {
                        name: "Sarah M.",
                        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                        status: "online"
                    }
                ]
            },
            {
                id: 103,
                title: "3. Non-verbal Cues",
                duration: "20:15",
                isLocked: false,
                currentPartners: [
                    {
                        name: "BK",
                        initials: "BK",
                        avatar: null,
                        bgColor: "bg-orange-100",
                        textColor: "text-secondary",
                        status: "idle"
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Module 3: Advanced Interaction",
        statusText: "Module 3 • Chưa Bắt Đầu",
        status: "NOT_STARTED",
        lessons: [
            {
                id: 104,
                title: "4. Feedback & Questioning",
                duration: "18:00",
                isLocked: true,
                currentPartners: []
            }
        ]
    }
];

export const modulesData = [
    {
        id: 1,
        title: "Module 1: Foundations of Web Architecture",
        description: "Tìm hiểu về mô hình Client-Server, giao thức HTTP và thiết kế CSDL quan hệ.",
        status: "COMPLETED",
        sortOrder: 1,
        lessons: [
            {
                id: 101,
                title: "Tổng quan về Kiến trúc Web",
                duration: "15 phút",
                isCompleted: true,
                completedByPartner: true,
                sortOrder: 1
            },
            {
                id: 102,
                title: "Thiết kế Cơ sở dữ liệu Relational",
                duration: "20 phút",
                isCompleted: true,
                completedByPartner: true,
                sortOrder: 2
            }
        ]
    },
    {
        id: 2,
        title: "Module 2: RESTful API Development",
        description: "Xây dựng backend APIs với Node.js, Express, Middleware và xác thực JWT.",
        status: "IN_PROGRESS",
        sortOrder: 2,
        lessons: [
            {
                id: 201,
                title: "Xây dựng API với Node.js & Express",
                duration: "25 phút",
                isCompleted: true,
                completedByPartner: false,
                sortOrder: 1
            },
            {
                id: 202,
                title: "Xác thực & Phân quyền với JWT",
                duration: "30 phút",
                isCompleted: false,
                completedByPartner: true,
                isPartnerCurrent: true,
                sortOrder: 2
            },
            {
                id: 203,
                title: "RESTful API Advanced & Middleware",
                duration: "22 phút",
                isCompleted: false,
                completedByPartner: false,
                sortOrder: 3
            }
        ]
    },
    {
        id: 3,
        title: "Module 3: Frontend Foundations & Integration",
        description: "Làm quen với React framework, hooks và tích hợp call API đồng bộ.",
        status: "NOT_STARTED",
        sortOrder: 3,
        lessons: [
            {
                id: 301,
                title: "React Foundation & Lifecycle",
                duration: "28 phút",
                isCompleted: false,
                completedByPartner: false,
                sortOrder: 1
            },
            {
                id: 302,
                title: "State Management with Context API",
                duration: "35 phút",
                isCompleted: false,
                completedByPartner: false,
                sortOrder: 2
            },
            {
                id: 303,
                title: "Tích hợp Frontend & Backend & CORS",
                duration: "25 phút",
                isCompleted: false,
                completedByPartner: false,
                sortOrder: 3
            }
        ]
    }
];

export const myLearningActiveCourses = [
    {
        id: 1,
        title: "React & Node.js Mastery",
        category: "Fullstack",
        icon: "code",
        description: "Cohorts 24 - Đang diễn ra",
        progress: 45
    },
    {
        id: 2,
        title: "Scalable Architecture",
        category: "System Design",
        icon: "settings_input_component",
        description: "Advanced Bootcamp",
        progress: 10
    }
];

export const myLearningAvailableCourses = [
    {
        id: 3,
        title: "CS Fundamentals",
        description: "Nền tảng vững chắc cho dev",
        studentCount: "1.2k",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=60"
    },
    {
        id: 4,
        title: "Cloud Engineering",
        description: "AWS, Docker & Kubernetes",
        studentCount: "800",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60"
    }
];



