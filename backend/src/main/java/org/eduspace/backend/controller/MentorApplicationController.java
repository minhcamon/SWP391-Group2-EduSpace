package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.mentor_application.request.MentorApplicationReviewRequest;
import org.eduspace.backend.dto.mentor_application.response.MentorApplicationDetailResponse;
import org.eduspace.backend.dto.mentor_application.response.MentorApplicationResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.MentorApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Mentor Application Controller", description = "Các API nộp đơn ứng tuyển Mentor và xét duyệt đơn cho Creator")
public class MentorApplicationController {

    private final MentorApplicationService mentorApplicationService;

    @PostMapping("/mentor-applications/apply/{classId}")
    @PreAuthorize("hasAnyRole('LEARNER', 'MENTOR')")
    @Operation(summary = "Apply to become a Mentor", description = "Học viên đăng ký trở thành Mentor sau khi hoàn thành khóa học")
    public ResponseEntity<APIResponse<String>> applyToBecomeMentor(@PathVariable Long classId) {
        Long userId = SecurityUtil.getCurrentUserId();
        mentorApplicationService.applyToBecomeMentor(userId, classId);
        return ResponseEntity.ok(APIResponse.success("Đăng ký ứng tuyển Mentor thành công!", null));
    }

    @GetMapping("/creator/mentor-applications")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get list of Mentor Applications for Creator", description = "Creator xem danh sách đơn xin làm mentor")
    public ResponseEntity<APIResponse<List<MentorApplicationResponse>>> getMentorApplications() {
        Long creatorId = SecurityUtil.getCurrentUserId();
        List<MentorApplicationResponse> response = mentorApplicationService.getMentorApplicationsForCreator(creatorId);
        return ResponseEntity.ok(APIResponse.success("Lấy danh sách đơn ứng tuyển thành công", response));
    }

    @GetMapping("/creator/mentor-applications/{applicationId}")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get details of a Mentor Application", description = "Creator xem chi tiết đơn ứng tuyển (kèm bài tập đã làm)")
    public ResponseEntity<APIResponse<MentorApplicationDetailResponse>> getApplicationDetails(@PathVariable Long applicationId) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        MentorApplicationDetailResponse response = mentorApplicationService.getApplicationDetails(applicationId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Lấy chi tiết đơn ứng tuyển thành công", response));
    }

    @PutMapping("/creator/mentor-applications/{applicationId}/approve")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Approve a Mentor Application", description = "Creator đồng ý duyệt đơn xin làm mentor")
    public ResponseEntity<APIResponse<String>> approveMentorApplication(@PathVariable Long applicationId) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        mentorApplicationService.approveMentorApplication(applicationId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Phê duyệt đơn ứng tuyển Mentor thành công!", null));
    }

    @PutMapping("/creator/mentor-applications/{applicationId}/reject")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Reject a Mentor Application", description = "Creator từ chối đơn xin làm mentor")
    public ResponseEntity<APIResponse<String>> rejectMentorApplication(
            @PathVariable Long applicationId,
            @RequestBody MentorApplicationReviewRequest request) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        mentorApplicationService.rejectMentorApplication(applicationId, creatorId, request.getRejectedReason());
        return ResponseEntity.ok(APIResponse.success("Từ chối đơn ứng tuyển Mentor thành công!", null));
    }
}
