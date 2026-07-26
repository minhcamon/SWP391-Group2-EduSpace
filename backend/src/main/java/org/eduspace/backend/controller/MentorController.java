package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.incident.response.MentorDashboardResponse;
import org.eduspace.backend.dto.study_group.response.GroupMessageResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairDetailResponse;
import org.eduspace.backend.dto.mentor.response.MentorClassDetailResponse;
import org.eduspace.backend.dto.mentor.response.WithdrawDetailResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairPeerReviewsResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairProgressResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairSubmissionsResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.MentorService;
import org.eduspace.backend.service.ProgressService;
import org.eduspace.backend.service.StudyGroupService;
import org.eduspace.backend.service.WithdrawService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
@Tag(name = "Mentor Controller", description = "Các API dành cho Mentor")
public class MentorController {

    private final MentorService mentorService;
    private final StudyGroupService studyGroupService;
    private final ProgressService progressService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get Mentor Dashboard Data", description = "Lấy số liệu tổng quan trên dashboard của mentor")
    public ResponseEntity<APIResponse<MentorDashboardResponse>> getDashboardData() {
        Long userId = SecurityUtil.getCurrentUserId();
        MentorDashboardResponse response = mentorService.getDashboardData(userId);
        return ResponseEntity.ok(APIResponse.success("Get mentor dashboard data successfully", response));
    }

    @GetMapping("/pairs/{pairId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get pair details", description = "Mentor xem thông tin một cặp học viên trong lớp")
    public ResponseEntity<APIResponse<MentorPairDetailResponse>> getPairDetail(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairDetailResponse response = studyGroupService.getPairDetailForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair detail successfully", response));
    }

    @GetMapping("/pairs/{pairId}/chat")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get pair chat history", description = "Mentor xem lịch sử trò chuyện của một cặp học viên trong lớp")
    public ResponseEntity<APIResponse<List<GroupMessageResponse>>> getPairChat(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        List<GroupMessageResponse> response = studyGroupService.getPairChatForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair chat history successfully", response));
    }

    @GetMapping("/pairs/{pairId}/progress")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get pair progress detail", description = "Mentor xem chi tiết tiến độ học tập của một cặp học viên trong lớp")
    public ResponseEntity<APIResponse<MentorPairProgressResponse>> getPairProgress(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairProgressResponse response = progressService.getPairProgressForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair progress successfully", response));
    }

    @GetMapping("/pairs/{pairId}/submissions")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get pair submissions", description = "Mentor xem tất cả bài nộp của các học viên trong một cặp")
    public ResponseEntity<APIResponse<MentorPairSubmissionsResponse>> getPairSubmissions(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairSubmissionsResponse response = studyGroupService.getPairSubmissionsForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair submissions successfully", response));
    }

    @GetMapping("/pairs/{pairId}/peer-reviews")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get pair peer reviews", description = "Mentor xem tất cả peer review liên quan đến các thành viên trong một cặp")
    public ResponseEntity<APIResponse<MentorPairPeerReviewsResponse>> getPairPeerReviews(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairPeerReviewsResponse response = studyGroupService.getPairPeerReviewsForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair peer reviews successfully", response));
    }

    @GetMapping("/classes")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get Mentor Classes", description = "Lấy danh sách các lớp học do mentor hiện tại phụ trách")
    public ResponseEntity<APIResponse<List<org.eduspace.backend.dto.mentor.response.MentorClassResponse>>> getMentorClasses() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<org.eduspace.backend.dto.mentor.response.MentorClassResponse> response = mentorService
                .getMentorClasses(userId);
        return ResponseEntity.ok(APIResponse.success("Get classes successfully", response));
    }

    @GetMapping("/classes/{classId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get Mentor Class Detail", description = "Lấy chi tiết lớp học do mentor phụ trách")
    public ResponseEntity<APIResponse<MentorClassDetailResponse>> getMentorClassDetail(@PathVariable Long classId) {
        Long userId = SecurityUtil.getCurrentUserId();
        MentorClassDetailResponse response = mentorService.getMentorClassDetail(classId, userId);
        return ResponseEntity.ok(APIResponse.success("Get class detail successfully", response));
    }

    @GetMapping("/classes/{classId}/pairs")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get Mentor Class Pairs", description = "Lấy danh sách các cặp/nhóm học tập trong lớp")
    public ResponseEntity<APIResponse<List<StudyGroupResponse>>> getMentorClassPairs(@PathVariable Long classId) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<StudyGroupResponse> response = mentorService.getMentorClassPairs(classId, userId);
        return ResponseEntity.ok(APIResponse.success("Get class pairs successfully", response));
    }

    @GetMapping("/active-courses")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get Active Courses", description = "Lấy danh sách cấu hình nhận lớp giảng dạy của mentor")
    public ResponseEntity<APIResponse<List<org.eduspace.backend.dto.mentor.response.ActiveMentorResponse>>> getActiveCourses() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<org.eduspace.backend.dto.mentor.response.ActiveMentorResponse> response = mentorService
                .getActiveCoursesForMentor(userId);
        return ResponseEntity.ok(APIResponse.success("Get active courses config successfully", response));
    }

    @PostMapping("/active-courses")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Register Active Course", description = "Đăng ký giảng dạy khóa học mới")
    public ResponseEntity<APIResponse<String>> registerActiveCourse(@RequestBody java.util.Map<String, Long> payload) {
        Long userId = SecurityUtil.getCurrentUserId();
        Long courseId = payload.get("courseId");
        mentorService.assignMentorToCourse(userId, courseId);
        return ResponseEntity.ok(APIResponse.success("Đăng ký nhận lớp thành công!", null));
    }

    @PutMapping("/active-courses/{courseId}/status")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Update Active Course Status", description = "Cập nhật trạng thái hoạt động của mentor cho khóa học")
    public ResponseEntity<APIResponse<String>> updateActiveCourseStatus(
            @PathVariable Long courseId,
            @RequestBody java.util.Map<String, String> payload) {
        Long userId = SecurityUtil.getCurrentUserId();
        org.eduspace.backend.enums.MentorStatus status = org.eduspace.backend.enums.MentorStatus
                .valueOf(payload.get("status"));
        mentorService.updateActiveMentorStatus(userId, courseId, status);
        return ResponseEntity.ok(APIResponse.success("Cập nhật trạng thái thành công!", null));
    }
}
