package org.eduspace.backend.enums;

public enum IncidentType {
    ASSIGNMENT_DISPUTE, // Tranh chấp điểm số bài tập (bao gồm chấm chéo) hoặc yêu cầu chấm lại
    MEMBER_CONFLICT, // Xung đột trong quá trình học
    SYSTEM_ERROR, // Lỗi hệ thống
    INACTIVE_PARTNER, // Partner không hoạt động
    RESCUE_SUPPORT_REQUEST, // Yêu cầu hỗ trợ khẩn cấp (ví dụ: bị hỏng máy, quên máy tính ở nhà,...)
    OTHER // Khác
}
