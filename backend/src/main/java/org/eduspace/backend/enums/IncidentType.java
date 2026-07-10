package org.eduspace.backend.enums;

public enum IncidentType {
    PEER_REVIEW_DISPUTE, // Khiếu nại điểm do bạn học chấm sai, hoặc nhầm
    GRADE_OVERRIDE_REQUEST, // Yêu cầu Mentor nhảy vào chấm lại bài (hoặc ghi đè điểm)
    MEMBER_CONFLICT, // Xung đột trong quá trình học
    SYSTEM_ERROR, // Lỗi hệ thống
    INACTIVE_PARTNER, // Partner không hoạt động
    RESCUE_SUPPORT_REQUEST, // Yêu cầu hỗ trợ khẩn cấp (ví dụ: bị hỏng máy, quên máy tính ở nhà,
    OTHER // Khác
}
