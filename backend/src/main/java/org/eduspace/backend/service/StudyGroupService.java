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
import org.eduspace.backend.dto.study_group.response.MentorPairDetailResponse;
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

    public MentorPairDetailResponse getPairDetailForMentor(Long pairId, Long mentorUserId) {
        StudyGroup studyGroup = studyGroupRepository.findById(pairId)
                .orElseThrow(() -> new RuntimeException("Pair not found"));

        ClassMember mentorMembership = classMemberRepository.findByUserIdAndCourseClassId(mentorUserId, studyGroup.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("You are not a mentor in this class"));

        if (!"MENTOR".equals(mentorMembership.getContextRole())) {
            throw new RuntimeException("You are not a mentor in this class");
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroup.getId());
        List<MentorPairDetailResponse.PairMemberResponse> memberResponses = groupMembers.stream()
                .map(gm -> {
                    ClassMember cm = gm.getClassMember();
                    return MentorPairDetailResponse.PairMemberResponse.builder()
                            .userId(cm.getUser() != null ? cm.getUser().getId() : null)
                            .name(cm.getUser() != null ? cm.getUser().getFullName() : null)
                            .avatarUrl(cm.getUser() != null ? cm.getUser().getAvatarUrl() : null)
                            .email(cm.getUser() != null ? cm.getUser().getEmail() : null)
                            .build();
                })
                .toList();

        MentorPairDetailResponse.PairMemberResponse student1 = memberResponses.size() > 0 ? memberResponses.get(0) : null;
        MentorPairDetailResponse.PairMemberResponse student2 = memberResponses.size() > 1 ? memberResponses.get(1) : null;
        int progress = memberResponses.size() >= 2 ? 72 : 0;
        String status = progress < 50 ? "SLOW" : "ACTIVE";

        return MentorPairDetailResponse.builder()
                .id(studyGroup.getId())
                .pairName("Pair " + studyGroup.getId())
                .className(studyGroup.getCourseClass() != null ? studyGroup.getCourseClass().getName() : null)
                .status(status)
                .progress(progress)
                .student1(student1)
                .student2(student2)
                .members(memberResponses)
                .build();
    }
}
