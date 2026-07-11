package org.eduspace.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.eduspace.backend.dto.study_group.request.SendMessageRequest;
import org.eduspace.backend.dto.study_group.response.GroupMemberDTO;
import org.eduspace.backend.dto.study_group.response.GroupMemberInfo;
import org.eduspace.backend.dto.study_group.response.GroupMessageResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.GroupMessage;
import org.eduspace.backend.entity.StudyGroup;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.GroupMessageRepository;
import org.eduspace.backend.repository.StudyGroupRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final GroupMemberRepository groupMemberRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final ClassMemberRepository classMemberRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ClassMember findPartnerForModule(ClassMember learner, Long moduleId) {
        List<GroupMember> userGroupMembers = groupMemberRepository.findByClassMemberId(learner.getId());

        StudyGroup studyGroup = userGroupMembers.stream()
                .map(GroupMember::getStudyGroup)
                .filter(g -> g.getModule() != null && g.getModule().getId().equals(moduleId))
                .findFirst()
                .orElse(null);

        if (studyGroup == null) {
            return null;
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroup.getId());

        return groupMembers.stream()
                .map(GroupMember::getClassMember)
                .filter(m -> !m.getId().equals(learner.getId()))
                .findFirst()
                .orElse(null);
    }

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

        groupMessage = groupMessageRepository.save(groupMessage);

        GroupMessageResponse response = GroupMessageResponse.builder()
                .id(groupMessage.getId())
                .content(groupMessage.getContent())
                .messageType(groupMessage.getMessageType())
                .sendAt(groupMessage.getSendAt())
                .senderGroupMemberId(groupMember.getId())
                .senderUserId(classMember.getUser().getId())
                .senderName(classMember.getUser().getFullName())
                .senderAvatar(classMember.getUser().getAvatarUrl())
                .build();

        messagingTemplate.convertAndSend("/topic/group/" + studyGroupId, response);
    }

    public List<GroupMessageResponse> getMessages(Long studyGroupId, Long currentUserId, Long classId) {
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

    public List<StudyGroupResponse> getAllStudyGroup(Long classId) {
        List<StudyGroup> studyGroups = studyGroupRepository.findByCourseClassId(classId);

        if (studyGroups.isEmpty()) {
            return new ArrayList<>();
        }

        List<StudyGroupResponse> groups = new ArrayList<>();

        for (StudyGroup studyGroup : studyGroups) {
            List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroup.getId());

            List<GroupMemberInfo> members = groupMembers.stream()
                    .map(gm -> {
                        ClassMember cm = gm.getClassMember();
                        return GroupMemberInfo.builder()
                                .userId(cm.getUser().getId())
                                .fullName(cm.getUser().getFullName())
                                .avatarUrl(cm.getUser().getAvatarUrl())
                                .build();
                    })
                    .toList();

            groups.add(StudyGroupResponse.builder()
                    .studyGroupId(studyGroup.getId())
                    .members(members)
                    .status(studyGroup.getChatStatus())
                    .build());
        }

        return groups;
    }

    public List<GroupMemberDTO> getMembersInGroup(Long studyGroupId) {
        return groupMemberRepository.findMembersByStudyGroupId(studyGroupId);
    }
}
