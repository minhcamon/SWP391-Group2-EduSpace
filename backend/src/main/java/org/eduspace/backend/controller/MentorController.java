package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.incident.response.MentorDashboardResponse;
import org.eduspace.backend.dto.study_group.response.GroupMessageResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairDetailResponse;
import org.eduspace.backend.dto.mentor.request.WithdrawRequestDto;
import org.eduspace.backend.dto.mentor.request.RejectArbitrationRequest;
import org.eduspace.backend.dto.mentor.response.MentorClassResponse;
import org.eduspace.backend.dto.mentor.response.MentorClassDetailResponse;
import org.eduspace.backend.dto.mentor.response.WithdrawDetailResponse;
import org.eduspace.backend.dto.mentor.response.MentorArbitrationResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairPeerReviewsResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairProgressResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairSubmissionsResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.dto.submission.request.PeerReviewGradeRequest;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.MentorService;
import org.eduspace.backend.service.ProgressService;
import org.eduspace.backend.service.StudyGroupService;
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
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get Mentor Dashboard Data", description = "Lấy số liệu tổng quan trên dashboard của mentor")
    public ResponseEntity<APIResponse<MentorDashboardResponse>> getDashboardData() {
        Long userId = SecurityUtil.getCurrentUserId();
        MentorDashboardResponse response = mentorService.getDashboardData(userId);
        return ResponseEntity.ok(APIResponse.success("Get mentor dashboard data successfully", response));
    }

    @GetMapping("/pairs/{pairId}")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get pair details", description = "Mentor xem thông tin một cặp học viên trong lớp")
    public ResponseEntity<APIResponse<MentorPairDetailResponse>> getPairDetail(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairDetailResponse response = studyGroupService.getPairDetailForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair detail successfully", response));
    }

    @GetMapping("/pairs/{pairId}/chat")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get pair chat history", description = "Mentor xem lịch sử trò chuyện của một cặp học viên trong lớp")
    public ResponseEntity<APIResponse<List<GroupMessageResponse>>> getPairChat(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        List<GroupMessageResponse> response = studyGroupService.getPairChatForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair chat history successfully", response));
    }

    @GetMapping("/pairs/{pairId}/progress")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get pair progress detail", description = "Mentor xem chi tiết tiến độ học tập của một cặp học viên trong lớp")
    public ResponseEntity<APIResponse<MentorPairProgressResponse>> getPairProgress(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairProgressResponse response = progressService.getPairProgressForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair progress successfully", response));
    }

    @GetMapping("/pairs/{pairId}/submissions")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get pair submissions", description = "Mentor xem tất cả bài nộp của các học viên trong một cặp")
    public ResponseEntity<APIResponse<MentorPairSubmissionsResponse>> getPairSubmissions(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairSubmissionsResponse response = studyGroupService.getPairSubmissionsForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair submissions successfully", response));
    }

    @GetMapping("/pairs/{pairId}/peer-reviews")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get pair peer reviews", description = "Mentor xem tất cả peer review liên quan đến các thành viên trong một cặp")
    public ResponseEntity<APIResponse<MentorPairPeerReviewsResponse>> getPairPeerReviews(@PathVariable Long pairId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorPairPeerReviewsResponse response = studyGroupService.getPairPeerReviewsForMentor(pairId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get pair peer reviews successfully", response));
    }

    @GetMapping("/arbitrations")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get list of arbitration requests", description = "Lấy danh sách các yêu cầu phân xử cho lớp mentor quản lý")
    public ResponseEntity<APIResponse<List<MentorArbitrationResponse>>> getArbitrations() {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        List<MentorArbitrationResponse> response = mentorService.getArbitrationsForMentor(mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get arbitration requests successfully", response));
    }

    @GetMapping("/arbitrations/{id}")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get arbitration request detail", description = "Xem chi tiết yêu cầu phân xử cho mentor trong lớp")
    public ResponseEntity<APIResponse<MentorArbitrationResponse>> getArbitrationDetail(@PathVariable("id") Long incidentId) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorArbitrationResponse response = mentorService.getArbitrationDetailForMentor(incidentId, mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get arbitration request detail successfully", response));
    }

    @PostMapping("/arbitrations/{id}/grade")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Regrade peer review in arbitration", description = "Mentor chấm điểm lại cho bài nộp trong yêu cầu phân xử")
    public ResponseEntity<APIResponse<MentorArbitrationResponse>> gradeArbitration(
            @PathVariable("id") Long incidentId,
            @Valid @RequestBody PeerReviewGradeRequest request) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorArbitrationResponse response = mentorService.gradeArbitrationSubmission(incidentId, mentorUserId, request);
        return ResponseEntity.ok(APIResponse.success("Regraded and resolved arbitration request successfully", response));
    }

    @PostMapping("/arbitrations/{id}/reject")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Reject arbitration request", description = "Từ chối phân xử cho yêu cầu phân xử trong lớp mentor quản lý")
    public ResponseEntity<APIResponse<MentorArbitrationResponse>> rejectArbitration(
            @PathVariable("id") Long incidentId,
            @Valid @RequestBody RejectArbitrationRequest request) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        MentorArbitrationResponse response = mentorService.rejectArbitrationRequest(incidentId, mentorUserId, request);
        return ResponseEntity.ok(APIResponse.success("Rejected arbitration request successfully", response));
    }

    @GetMapping("/classes")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get Mentor Classes", description = "Lấy danh sách các lớp học do mentor hiện tại phụ trách")
    public ResponseEntity<APIResponse<List<MentorClassResponse>>> getMentorClasses() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<MentorClassResponse> response = mentorService.getMentorClasses(userId);
        return ResponseEntity.ok(APIResponse.success("Get classes successfully", response));
    }

    @GetMapping("/classes/{classId}")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get Mentor Class Detail", description = "Lấy chi tiết lớp học do mentor phụ trách")
    public ResponseEntity<APIResponse<MentorClassDetailResponse>> getMentorClassDetail(@PathVariable Long classId) {
        Long userId = SecurityUtil.getCurrentUserId();
        MentorClassDetailResponse response = mentorService.getMentorClassDetail(classId, userId);
        return ResponseEntity.ok(APIResponse.success("Get class detail successfully", response));
    }

    @GetMapping("/classes/{classId}/pairs")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get Mentor Class Pairs", description = "Lấy danh sách các cặp/nhóm học tập trong lớp")
    public ResponseEntity<APIResponse<List<StudyGroupResponse>>> getMentorClassPairs(@PathVariable Long classId) {
        Long userId = SecurityUtil.getCurrentUserId();
        List<StudyGroupResponse> response = mentorService.getMentorClassPairs(classId, userId);
        return ResponseEntity.ok(APIResponse.success("Get class pairs successfully", response));
    }

    @PostMapping("/withdraw-request")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Request Withdrawal", description = "Gửi yêu cầu xin rút lui khỏi lớp học")
    public ResponseEntity<APIResponse<String>> createWithdrawRequest(@Valid @RequestBody WithdrawRequestDto dto) {
        Long userId = SecurityUtil.getCurrentUserId();
        mentorService.createWithdrawRequest(userId, dto);
        return ResponseEntity.ok(APIResponse.success("Gửi yêu cầu rút lui thành công!", null));
    }

    @GetMapping("/withdraw-request/{id}")
    @PreAuthorize("hasAnyRole('MENTOR', 'CREATOR', 'ADMIN')")
    @Operation(summary = "Get Withdraw Request Detail", description = "Xem chi tiết yêu cầu rút lui của mentor")
    public ResponseEntity<APIResponse<WithdrawDetailResponse>> getWithdrawRequest(@PathVariable Long id) {
        Long userId = SecurityUtil.getCurrentUserId();
        WithdrawDetailResponse response = mentorService.getWithdrawRequest(id, userId);
        return ResponseEntity.ok(APIResponse.success("Get withdraw request detail successfully", response));
    }
}
