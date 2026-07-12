package org.eduspace.backend.controller;

import java.util.List;

import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.service.StudyGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/class")
@RequiredArgsConstructor
@Tag(name = "Class", description = "Các API liên quan đến Lớp học (CourseClass)")
public class ClassController {

    private final StudyGroupService studyGroupService;

    @Operation(summary = "Lấy danh sách nhóm học tập", description = "Lấy danh sách các study groups (nhóm cộng đồng) trong một lớp học.")
    @GetMapping("/community/{classId}")
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
    public ResponseEntity<APIResponse<List<StudyGroupResponse>>> getCommunityGroups(@PathVariable Long classId) {
        List<StudyGroupResponse> response = studyGroupService.getAllStudyGroup(classId);
        return ResponseEntity.ok().body(APIResponse.success("Groups fetched successfully", response));
    }
}