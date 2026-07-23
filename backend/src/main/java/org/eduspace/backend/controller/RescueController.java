package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.rescue.request.InitiateRescueRequest;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.RescueService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rescues")
@RequiredArgsConstructor
@Tag(name = "Rescue Controller", description = "Quản lý Cứu trợ Học viên")
public class RescueController {

    private final RescueService rescueService;

    @PostMapping("/initiate")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Initiate a rescue", description = "Mentor chủ động mở vòng cứu trợ 48h cho học viên")
    public ResponseEntity<APIResponse<String>> initiateRescue(
            @Valid @RequestBody InitiateRescueRequest request) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        rescueService.initiateRescue(mentorUserId, request);
        return ResponseEntity.ok(APIResponse.success("Initiated rescue successfully", null));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Close a rescue case", description = "Mentor đóng ca cứu trợ (đánh giá học viên pass hay fail)")
    public ResponseEntity<APIResponse<String>> closeRescue(
            @PathVariable("id") Long rescueId,
            @Valid @RequestBody org.eduspace.backend.dto.rescue.request.CloseRescueRequest request) {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        rescueService.closeRescue(rescueId, mentorUserId, request);
        return ResponseEntity.ok(APIResponse.success("Closed rescue case successfully", null));
    }

    @GetMapping("/mentor")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get mentor's rescue cases", description = "Lấy danh sách các ca cứu trợ mà mentor đang phụ trách")
    public ResponseEntity<APIResponse<List<org.eduspace.backend.dto.rescue.response.RescueListResponse>>> getMentorRescues() {
        Long mentorUserId = SecurityUtil.getCurrentUserId();
        List<org.eduspace.backend.dto.rescue.response.RescueListResponse> response = rescueService.getMentorRescues(mentorUserId);
        return ResponseEntity.ok(APIResponse.success("Get mentor rescue cases successfully", response));
    }
}
