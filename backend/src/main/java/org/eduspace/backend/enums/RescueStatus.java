package org.eduspace.backend.enums;

public enum RescueStatus {
    PENDING, // Yêu cầu cứu trợ được tạo, đang chờ Mentor vào tiếp quản
    ON_GOING, // Mentor đã nhảy vào ca cứu trợ, đang hỗ trợ học viên trong vòng 48h
    SAVED, // Cứu trợ thành công! Học viên đã nộp bài bù kịp thời và được giữ lại lớp
    DROPPED // Cứu trợ thất bại! Quá 48h học viên không hoàn thành cứu viện, System
            // Scheduler tự động kích hoạt drop học viên khỏi lớp
}
