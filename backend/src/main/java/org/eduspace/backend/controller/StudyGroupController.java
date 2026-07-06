package org.eduspace.backend.controller;

import java.util.List;

import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.progress.response.ModuleStatusResponse;
import org.eduspace.backend.dto.study_group.request.SendMessageRequest;
import org.eduspace.backend.dto.study_group.response.GroupMemberDTO;
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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/group")
@RequiredArgsConstructor
@Tag(name = "Study Group", description = "Các API liên quan đến Nhóm học tập (Chat nhóm, bạn học, ...)")
public class StudyGroupController {

    private final StudyGroupService studyGroupService;
    private final LearnerModuleService learnerModuleService;

    @Operation(summary = "Gửi tin nhắn vào nhóm", description = "Học viên gửi tin nhắn chat trong study group của mình.")
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

    @Operation(summary = "Lấy tin nhắn nhóm", description = "Lấy lịch sử tin nhắn trong study group.")
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

    @Operation(summary = "Lấy trạng thái nộp bài của module", description = "Kiểm tra xem học viên đã hoàn thành (nộp) bài của module hay chưa.")
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

    // API lấy danh sách thành viên trong nhóm
    @Operation(summary = "Lấy thành viên nhóm", description = "Lấy danh sách thành viên trong study group.")
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMemberDTO>> getGroupMembers(@PathVariable Long groupId) {
        List<GroupMemberDTO> members = studyGroupService.getMembersInGroup(groupId);
        return ResponseEntity.ok(members);
    }
}
