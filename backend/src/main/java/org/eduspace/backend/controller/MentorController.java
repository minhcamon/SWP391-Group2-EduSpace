package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.incident.response.MentorDashboardResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.MentorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mentor")
@RequiredArgsConstructor
@Tag(name = "Mentor Controller", description = "Lấy Dashboard cho mentor")
public class MentorController {

    private final MentorService mentorService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get Mentor Dashboard Data", description = "Lấy số liệu tổng quan trên dashboard của mentor")
    public ResponseEntity<APIResponse<MentorDashboardResponse>> getDashboardData() {
        Long userId = SecurityUtil.getCurrentUserId();
        MentorDashboardResponse response = mentorService.getDashboardData(userId);
        return ResponseEntity.ok(APIResponse.success("Get mentor dashboard data successfully", response));
    }
}
