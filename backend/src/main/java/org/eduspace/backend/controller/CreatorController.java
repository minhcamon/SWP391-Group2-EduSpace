package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.creator.response.CreatorAnalyticsResponse;
import org.eduspace.backend.dto.creator.response.ClassTimelineResponse;
import org.eduspace.backend.dto.mentor.request.AssignMentorRequestDto;
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

    @GetMapping("/courses/{courseId}/classes-timeline")
    @PreAuthorize("hasRole('CREATOR')")
    @Operation(summary = "Get Classes Timeline", description = "Lấy dòng thời gian các module của các lớp học thuộc khóa học (chỉ cho Creator sở hữu)")
    public ResponseEntity<APIResponse<List<ClassTimelineResponse>>> getClassesTimeline(@PathVariable Long courseId) {
        Long creatorId = SecurityUtil.getCurrentUserId();
        List<ClassTimelineResponse> response = creatorClassService.getClassesTimeline(courseId, creatorId);
        return ResponseEntity.ok(APIResponse.success("Get classes timeline successfully", response));
    }
}
