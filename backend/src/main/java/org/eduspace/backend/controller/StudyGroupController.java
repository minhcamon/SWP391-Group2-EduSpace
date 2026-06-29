package org.eduspace.backend.controller;

import java.util.List;

import org.eduspace.backend.dto.group.GroupMemberDTO;
import org.eduspace.backend.service.StudyGroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {
    private final StudyGroupService studyGroupService;

    // API lấy danh sách thành viên trong nhóm
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMemberDTO>> getGroupMembers(@PathVariable Long groupId) {
        List<GroupMemberDTO> members = studyGroupService.getMembersInGroup(groupId);
        return ResponseEntity.ok(members);
    }
}
