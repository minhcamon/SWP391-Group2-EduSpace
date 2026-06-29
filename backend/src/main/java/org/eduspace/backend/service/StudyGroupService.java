package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.group.GroupMemberDTO;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final GroupMemberRepository groupMemberRepository;

    public List<GroupMemberDTO> getMembersInGroup(Long studyGroupId) {
        // Có thể bổ sung thêm check xem nhóm này có tồn tại hay không nếu cần
        return groupMemberRepository.findMembersByStudyGroupId(studyGroupId);
    }
}