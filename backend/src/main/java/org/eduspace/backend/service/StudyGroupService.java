package org.eduspace.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.eduspace.backend.dto.study_group.request.SendMessageRequest;
import org.eduspace.backend.dto.study_group.response.GroupMessageResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.GroupMessage;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.GroupMessageRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final GroupMemberRepository groupMemberRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final ClassMemberRepository classMemberRepository;

    @Transactional
    public void sendMessage(Long studyGroupId, SendMessageRequest request, Long senderId, Long classId) {

        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(senderId, classId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this class"));

        GroupMember groupMember = groupMemberRepository
                .findByStudyGroupIdAndClassMemberId(studyGroupId, classMember.getId())
                .orElseThrow(() -> new RuntimeException("Not a member of this group"));

        GroupMessage groupMessage = GroupMessage.builder()
                .content(request.getContent())
                .messageType(request.getMessageType())
                .studyGroup(groupMember.getStudyGroup())
                .sender(groupMember)
                .sendAt(LocalDateTime.now())
                .build();

        groupMessageRepository.save(groupMessage);
    }

    public List<GroupMessageResponse> getMessages(Long studyGroupId, Long currentUserId, Long classId) {
        // Kiểm tra user có phải là thành viên của class và nhóm học không
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(currentUserId, classId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this class"));
        groupMemberRepository
                .findByStudyGroupIdAndClassMemberId(studyGroupId, classMember.getId())
                .orElseThrow(() -> new RuntimeException("Not a member of this group"));

        List<GroupMessage> messages = groupMessageRepository.findByStudyGroupIdOrderBySendAtAsc(studyGroupId);

        return messages.stream().map(msg -> GroupMessageResponse.builder()
                .id(msg.getId())
                .content(msg.getContent())
                .messageType(msg.getMessageType())
                .sendAt(msg.getSendAt())
                .senderGroupMemberId(msg.getSender().getId())
                .senderUserId(msg.getSender().getClassMember().getUser().getId())
                .senderName(msg.getSender().getClassMember().getUser().getFullName())
                .senderAvatar(msg.getSender().getClassMember().getUser().getAvatarUrl())
                .build()).collect(Collectors.toList());
    }
}
