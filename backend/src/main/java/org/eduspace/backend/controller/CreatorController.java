package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.creator.response.CreatorAnalyticsResponse;
import org.eduspace.backend.dto.mentor.request.AssignMentorRequestDto;
import org.eduspace.backend.dto.mentor.request.HandoverRequestDto;
import org.eduspace.backend.dto.mentor.response.MentorResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CreatorClassService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/creator")
@RequiredArgsConstructor
@Tag(name = "Creator Class Controller", description = "Các API của Creator dùng quản lý lớp học và mentor")
public class CreatorController {

    private final CreatorClassService creatorClassService;
    private final org.eduspace.backend.service.WithdrawService withdrawService;

    @GetMapping("/classes/{classId}/mentors")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get Class Mentors", description = "Lấy danh sách các mentor trong lớp học (chỉ cho Creator sở hữu khóa học)")
    public ResponseEntity<APIResponse<List<MentorResponse>>> getClassMentors(@PathVariable Long classId) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        List<MentorResponse> response = creatorClassService.getClassMentors(classId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Get mentors successfully", response));
    }

    @PostMapping("/classes/{classId}/mentors")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Add Mentor to Class", description = "Gán thêm mentor vào lớp học (chỉ cho Creator sở hữu khóa học)")
    public ResponseEntity<APIResponse<String>> addMentorToClass(
            @PathVariable Long classId,
            @Valid @RequestBody AssignMentorRequestDto request) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        creatorClassService.addMentorToClass(classId, request.getMentorId(), creatorId);
        return ResponseEntity.ok(APIResponse.success("Gán mentor vào lớp học thành công!", null));
    }

    @DeleteMapping("/classes/{classId}/mentors/{mentorId}")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Remove Mentor from Class", description = "Xóa mentor khỏi lớp học (chỉ cho Creator sở hữu khóa học)")
    public ResponseEntity<APIResponse<String>> removeMentorFromClass(
            @PathVariable Long classId,
            @PathVariable Long mentorId) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        creatorClassService.removeMentorFromClass(classId, mentorId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Xóa mentor khỏi lớp học thành công!", null));
    }

    @GetMapping("/withdraw-requests")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get Creator Withdraw Requests", description = "Xem danh sách các đơn rút lui gửi tới Creator")
    public ResponseEntity<APIResponse<List<org.eduspace.backend.dto.mentor.response.WithdrawDetailResponse>>> getWithdrawRequestsForCreator() {
        Long creatorId = SecurityUtil.getCurrentUserId();
        List<org.eduspace.backend.dto.mentor.response.WithdrawDetailResponse> response = withdrawService.getWithdrawRequestsForCreator(creatorId);
        return ResponseEntity.ok(APIResponse.success("Get withdraw requests successfully", response));
    }

    @GetMapping("/classes/{classId}/active-mentors")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get Active Mentors for Class Handover", description = "Lấy danh sách các mentor khả dụng để bàn giao cho lớp học này")
    public ResponseEntity<APIResponse<List<MentorResponse>>> getActiveMentorsForClass(@PathVariable Long classId) {
        List<MentorResponse> response = withdrawService.getActiveMentorsForClass(classId);
        return ResponseEntity.ok(APIResponse.success("Get active mentors successfully", response));
    }

    @PostMapping("/withdraw-requests/{id}/reject")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Reject Withdraw Request", description = "Từ chối yêu cầu rút lui của mentor")
    public ResponseEntity<APIResponse<String>> rejectWithdrawRequest(@PathVariable Long id) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        withdrawService.rejectWithdrawRequest(id, creatorId);
        return ResponseEntity.ok(APIResponse.success("Từ chối đơn rút lui thành công!", null));
    }

    @PostMapping("/withdraw-requests/{id}/initiate-handover")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Initiate Handover", description = "Chỉ định mentor mới để bàn giao lớp học")
    public ResponseEntity<APIResponse<String>> initiateHandover(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, Long> payload) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        Long newMentorUserId = payload.get("newMentorUserId");
        withdrawService.initiateHandover(id, newMentorUserId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Thiết lập bàn giao lớp học thành công!", null));
    }

    @PostMapping("/withdraw-requests/{id}/approve-handover")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Approve Handover", description = "Phê duyệt bàn giao lớp học cho mentor mới")
    public ResponseEntity<APIResponse<String>> approveHandover(@PathVariable Long id) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        withdrawService.approveHandover(id, creatorId);
        return ResponseEntity.ok(APIResponse.success("Phê duyệt và hoàn tất bàn giao lớp học thành công!", null));
    }

    @PostMapping("/withdraw-requests/{id}/take-over")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Creator Take Over Class", description = "Creator tự mình tiếp quản lớp học")
    public ResponseEntity<APIResponse<String>> creatorTakeOver(@PathVariable Long id) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        withdrawService.creatorTakeOver(id, creatorId);
        return ResponseEntity.ok(APIResponse.success("Creator tiếp quản lớp học thành công!", null));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get Creator Analytics", description = "Lấy dữ liệu thống kê phân tích của Creator")
    public ResponseEntity<APIResponse<CreatorAnalyticsResponse>> getAnalytics(
            @RequestParam(required = false) String courseId,
            @RequestParam(required = false) String timeRange) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        CreatorAnalyticsResponse response = creatorClassService.getCreatorAnalytics(creatorId, courseId, timeRange);
        return ResponseEntity.ok(APIResponse.success("Get analytics successfully", response));
    }
}
