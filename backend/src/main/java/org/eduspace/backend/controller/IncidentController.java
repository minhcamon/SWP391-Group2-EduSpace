package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.incident.request.ResolveIncidentRequest;
import org.eduspace.backend.dto.incident.response.IncidentDetailResponse;
import org.eduspace.backend.dto.incident.response.IncidentListResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Tag(name = "Incident Controller", description = "Quản lý các sự cố")
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get list of incidents", description = "Lấy danh sách các sự cố do mentor phụ trách")
    public ResponseEntity<APIResponse<List<IncidentListResponse>>> getIncidents() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<IncidentListResponse> response = incidentService.getIncidents(userId);
        return ResponseEntity.ok(APIResponse.success("Get incidents successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get incident details", description = "Lấy chi tiết một sự cố")
    public ResponseEntity<APIResponse<IncidentDetailResponse>> getIncidentDetail(@PathVariable("id") Long incidentId) {
        Long userId = SecurityUtil.getCurrentUserId();
        IncidentDetailResponse response = incidentService.getIncidentDetail(incidentId, userId);
        return ResponseEntity.ok(APIResponse.success("Get incident detail successfully", response));
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Accept an incident", description = "Mentor tiếp nhận xử lý một sự cố")
    public ResponseEntity<APIResponse<String>> acceptIncident(@PathVariable("id") Long incidentId) {
        Long userId = SecurityUtil.getCurrentUserId();
        incidentService.acceptIncident(incidentId, userId);
        return ResponseEntity.ok(APIResponse.success("Accepted incident successfully", null));
    }

    @PutMapping("/{id}/resolve")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Resolve an incident", description = "Mentor hoàn tất xử lý sự cố (Đã giải quyết xong)")
    public ResponseEntity<APIResponse<String>> resolveIncident(
            @PathVariable("id") Long incidentId,
            @Valid @RequestBody ResolveIncidentRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        incidentService.resolveIncident(incidentId, userId, request);
        return ResponseEntity.ok(APIResponse.success("Resolved incident successfully", null));

    }
}
