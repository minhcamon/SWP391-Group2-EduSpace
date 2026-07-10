package org.eduspace.backend.enums;

public enum IncidentStatus {
    PENDING, // Đơn đã gửi, chờ xử lý
    IN_PROGRESS, // Đang xử lý
    RESOLVED, // Đã xử lý
    REJECTED, // Đã từ chối
    CLOSED // Đã đóng
}
