package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.incident.request.LearnerMentorSupportRequest;
import org.eduspace.backend.dto.incident.response.LearnerMentorSupportResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.LearnerMentorSupportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/learner/mentor-support")
@RequiredArgsConstructor
@Tag(name = "Learner Mentor Support", description = "Cho phép học viên gửi yêu cầu cứu trợ mentor cho khóa học")
public class LearnerMentorSupportController {

    private final LearnerMentorSupportService learnerMentorSupportService;

    @PostMapping
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
    @Operation(summary = "Create mentor rescue request", description = "Học viên gửi yêu cầu mentor hỗ trợ khẩn cấp cho một khóa học")
    public ResponseEntity<APIResponse<LearnerMentorSupportResponse>> requestMentorSupport(
            @Valid @RequestBody LearnerMentorSupportRequest request) {
        Long learnerId = SecurityUtil.getCurrentUserId();
        LearnerMentorSupportResponse response = learnerMentorSupportService.createMentorSupportRequest(learnerId,
                request);
        return ResponseEntity.ok(APIResponse.success("Mentor support request created successfully", response));
    }
}
