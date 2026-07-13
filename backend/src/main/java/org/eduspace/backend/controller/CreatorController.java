package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
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

    @PostMapping("/handover/{requestId}")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Initiate Handover", description = "Chỉ định mentor mới để bàn giao (chỉ cho Creator sở hữu khóa học)")
    public ResponseEntity<APIResponse<String>> initiateHandover(
            @PathVariable Long requestId,
            @Valid @RequestBody HandoverRequestDto request) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        creatorClassService.initiateHandover(requestId, request.getNewMentorId(), creatorId);
        return ResponseEntity.ok(APIResponse.success("Thiết lập bàn giao lớp học thành công!", null));
    }

    @PostMapping("/handover/{requestId}/approve")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Approve Handover", description = "Phê duyệt bàn giao lớp học, đổi mentor trong lớp (chỉ cho Creator sở hữu khóa học)")
    public ResponseEntity<APIResponse<String>> approveHandover(@PathVariable Long requestId) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        creatorClassService.approveHandover(requestId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Phê duyệt và hoàn tất bàn giao lớp học thành công!", null));
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get Creator Analytics", description = "Lấy dữ liệu thống kê phân tích của Creator")
    public ResponseEntity<APIResponse<org.eduspace.backend.dto.creator.response.CreatorAnalyticsResponse>> getAnalytics() {
        Long creatorId = SecurityUtil.getCurrentUserId();
        org.eduspace.backend.dto.creator.response.CreatorAnalyticsResponse response = creatorClassService.getCreatorAnalytics(creatorId);
        return ResponseEntity.ok(APIResponse.success("Get analytics successfully", response));
    }
}
