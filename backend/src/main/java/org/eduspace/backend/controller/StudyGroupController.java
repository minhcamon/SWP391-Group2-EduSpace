package org.eduspace.backend.controller;

import java.util.List;

import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.progress.response.ModuleStatusResponse;
import org.eduspace.backend.dto.study_group.request.SendMessageRequest;
import org.eduspace.backend.dto.study_group.response.GroupMessageResponse;
import org.eduspace.backend.enums.LearnerModuleStatus;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.LearnerModuleService;
import org.eduspace.backend.service.StudyGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/group")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;
    private final LearnerModuleService learnerModuleService;

    @PostMapping("/send-message/{studyGroupId}/{classId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<APIResponse<?>> sendMessage(
            @RequestBody SendMessageRequest request,
            @PathVariable Long studyGroupId,
            @PathVariable Long classId) {

        Long currentId = SecurityUtil.getCurrentUserId();

        try {
            studyGroupService.sendMessage(studyGroupId, request, currentId, classId);
            return ResponseEntity
                    .ok()
                    .body(APIResponse.success("Message sent successfully", null));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(APIResponse.error(400, e.getMessage(), null));
        }
    }

    @GetMapping("/messages/{studyGroupId}/{classId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<APIResponse<?>> getMessages(
            @PathVariable Long studyGroupId,
            @PathVariable Long classId) {

        Long currentId = SecurityUtil.getCurrentUserId();

        try {
            List<GroupMessageResponse> messages = studyGroupService.getMessages(studyGroupId, currentId, classId);
            return ResponseEntity
                    .ok()
                    .body(APIResponse.success("Messages fetched successfully", messages));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(APIResponse.error(400, e.getMessage(), null));
        }
    }

    @GetMapping("/modules/{moduleId}/submission-status")
    @PreAuthorize("hasRole('LEARNER') or hasRole('ADMIN')")
    public ResponseEntity<APIResponse<ModuleStatusResponse>> getModuleSubmissionStatus(
            @PathVariable Long moduleId,
            @RequestParam Long learnerId) {
        try {
            // Gọi sang service xử lý dữ liệu thật từ DB
            LearnerModuleStatus status = learnerModuleService.getModuleStatusForLearner(learnerId, moduleId);
            
            // Build dữ liệu trả về kết quả
            ModuleStatusResponse responseData = ModuleStatusResponse.builder()
                    .learnerId(learnerId)
                    .moduleId(moduleId)
                    .status(status)
                    .build();

            return ResponseEntity.ok()
                    .body(APIResponse.success("Check learner module submission status successfully", responseData));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(APIResponse.error(400, e.getMessage(), null));
        }
    }
}
