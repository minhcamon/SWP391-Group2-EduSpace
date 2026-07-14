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
import org.springframework.web.bind.annotation.PostMapping;
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
    @Operation(summary = "Get list of incidents", description = "Lấy danh sách các sự cố do mentor phụ trách (IN_PROGRESS)")
    public ResponseEntity<APIResponse<List<IncidentListResponse>>> getIncidents() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<IncidentListResponse> response = incidentService.getIncidents(userId);
        return ResponseEntity.ok(APIResponse.success("Get incidents successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
    @Operation(summary = "Get my incidents", description = "Lấy danh sách các yêu cầu đã gửi của learner")
    public ResponseEntity<APIResponse<List<IncidentListResponse>>> getMyIncidents() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<IncidentListResponse> response = incidentService.getMyIncidents(userId);
        return ResponseEntity.ok(APIResponse.success("Get my incidents successfully", response));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
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

    @PostMapping("/{id}/mediate")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Mediate a pair incident", description = "Mentor hòa giải hai bạn học viên và đóng sự cố")
    public ResponseEntity<APIResponse<String>> mediateIncident(
            @PathVariable("id") Long incidentId,
            @Valid @RequestBody ResolveIncidentRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        incidentService.mediateIncident(incidentId, userId, request);
        return ResponseEntity.ok(APIResponse.success("Mediated incident successfully", null));
    }

    @PostMapping("/{id}/warn")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Warn learner in incident", description = "Mentor cảnh báo học viên và đóng sự cố")
    public ResponseEntity<APIResponse<String>> warnIncident(
            @PathVariable("id") Long incidentId,
            @Valid @RequestBody ResolveIncidentRequest request) {
        Long userId = SecurityUtil.getCurrentUserId();
        incidentService.warnIncident(incidentId, userId, request);
        return ResponseEntity.ok(APIResponse.success("Warned learner successfully", null));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('MENTOR')")
    @Operation(summary = "Get history of resolved incidents", description = "Lấy lịch sử các sự cố đã được mentor xử lý")
    public ResponseEntity<APIResponse<List<IncidentListResponse>>> getIncidentHistory() {
        Long userId = SecurityUtil.getCurrentUserId();
        List<IncidentListResponse> response = incidentService.getIncidentHistory(userId);
        return ResponseEntity.ok(APIResponse.success("Get incident history successfully", response));
    }

}
