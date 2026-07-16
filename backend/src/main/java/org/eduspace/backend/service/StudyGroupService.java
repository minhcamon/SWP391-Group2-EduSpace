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
import org.eduspace.backend.dto.study_group.response.MentorPairPeerReviewsResponse;
import org.eduspace.backend.dto.study_group.response.MentorPairSubmissionsResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.dto.study_group.response.ClassLeaderboardResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.GroupMessage;
import org.eduspace.backend.entity.PeerReview;
import org.eduspace.backend.entity.StudyGroup;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.repository.ClassRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.GroupMessageRepository;
import org.eduspace.backend.repository.PeerReviewRepository;
import org.eduspace.backend.repository.StudyGroupRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.eduspace.backend.dto.study_group.response.ClassDetailResponse;
import org.eduspace.backend.entity.CourseClass;
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
    private final ProgressService progressService;
    private final SubmissionRepository submissionRepository;
    private final PeerReviewRepository peerReviewRepository;
    private final ClassRepository classRepository;

    public ClassDetailResponse getClassDetail(Long classId) {
        CourseClass cc = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        int totalStudents = classMemberRepository.findByCourseClassIdAndContextRole(classId, "LEARNER").size();

        return ClassDetailResponse.builder()
                .classId(cc.getId())
                .cohortName(cc.getName())
                .courseId(cc.getCourse().getId())
                .courseTitle(cc.getCourse().getTitle())
                .status(cc.getStatus().name())
                .totalStudents(totalStudents)
                .build();
    }

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
            Long courseId = (studyGroup.getCourseClass() != null && studyGroup.getCourseClass().getCourse() != null)
                    ? studyGroup.getCourseClass().getCourse().getId()
                    : null;

            List<GroupMemberInfo> members = groupMembers.stream()
                    .map(gm -> {
                        ClassMember cm = gm.getClassMember();
                        Double p = 0.0;
                        if (courseId != null) {
                            p = progressService.getLearnerProgressPercentage(
                                    cm.getId(), courseId);
                        }
                        return GroupMemberInfo.builder()
                                .userId(cm.getUser().getId())
                                .fullName(cm.getUser().getFullName())
                                .avatarUrl(cm.getUser().getAvatarUrl())
                                .progress(p)
                                .build();
                    })
                    .toList();

            double sumProgress = 0.0;
            double averageProgress = 0.0;
            if (courseId != null) {
                for (GroupMember gm : groupMembers) {
                    sumProgress += progressService.getLearnerProgressPercentage(
                            gm.getClassMember().getId(), courseId);
                }
                averageProgress = groupMembers.isEmpty() ? 0.0
                        : Math.round((sumProgress / groupMembers.size()) * 10.0) / 10.0;
            }

            groups.add(StudyGroupResponse.builder()
                    .studyGroupId(studyGroup.getId())
                    .members(members)
                    .status(studyGroup.getChatStatus())
                    .progress(averageProgress)
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

        ClassMember mentorMembership = classMemberRepository
                .findByUserIdAndCourseClassId(mentorUserId, studyGroup.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("You are not a mentor in this class"));

        if (!"MENTOR".equals(mentorMembership.getContextRole())) {
            throw new RuntimeException("You are not a mentor in this class");
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroup.getId());
        Long courseId = (studyGroup.getCourseClass() != null && studyGroup.getCourseClass().getCourse() != null)
                ? studyGroup.getCourseClass().getCourse().getId()
                : null;

        List<MentorPairDetailResponse.PairMemberResponse> memberResponses = groupMembers.stream()
                .map(gm -> {
                    ClassMember cm = gm.getClassMember();
                    Double p = 0.0;
                    if (courseId != null) {
                        p = progressService.getLearnerProgressPercentage(cm.getId(), courseId);
                    }
                    return MentorPairDetailResponse.PairMemberResponse.builder()
                            .userId(cm.getUser() != null ? cm.getUser().getId() : null)
                            .name(cm.getUser() != null ? cm.getUser().getFullName() : null)
                            .avatarUrl(cm.getUser() != null ? cm.getUser().getAvatarUrl() : null)
                            .email(cm.getUser() != null ? cm.getUser().getEmail() : null)
                            .progress(p)
                            .build();
                })
                .toList();

        MentorPairDetailResponse.PairMemberResponse student1 = memberResponses.size() > 0
                ? memberResponses.get(0)
                : null;
        MentorPairDetailResponse.PairMemberResponse student2 = memberResponses.size() > 1
                ? memberResponses.get(1)
                : null;
        double sumProgress = 0.0;
        double progress = 0.0;
        if (courseId != null) {
            for (GroupMember gm : groupMembers) {
                sumProgress += progressService.getLearnerProgressPercentage(gm.getClassMember().getId(),
                        courseId);
            }
            progress = groupMembers.isEmpty() ? 0.0 : Math.round((sumProgress / groupMembers.size()) * 10.0) / 10.0;
        }
        String status = progress < 50.0 ? "SLOW" : "ACTIVE";

        return MentorPairDetailResponse.builder()
                .id(studyGroup.getId())
                .pairName("Pair " + studyGroup.getId())
                .className(studyGroup.getCourseClass() != null ? studyGroup.getCourseClass().getName()
                        : null)
                .status(status)
                .progress(progress)
                .student1(student1)
                .student2(student2)
                .members(memberResponses)
                .build();
    }

    public List<GroupMessageResponse> getPairChatForMentor(Long pairId, Long mentorUserId) {
        StudyGroup studyGroup = studyGroupRepository.findById(pairId)
                .orElseThrow(() -> new RuntimeException("Pair not found"));

        ClassMember mentorMembership = classMemberRepository
                .findByUserIdAndCourseClassId(mentorUserId, studyGroup.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("You are not a mentor in this class"));

        if (!"MENTOR".equals(mentorMembership.getContextRole())) {
            throw new RuntimeException("You are not a mentor in this class");
        }

        List<GroupMessage> messages = groupMessageRepository.findByStudyGroupIdOrderBySendAtAsc(pairId);

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

    public MentorPairSubmissionsResponse getPairSubmissionsForMentor(Long pairId, Long mentorUserId) {
        StudyGroup studyGroup = studyGroupRepository.findById(pairId)
                .orElseThrow(() -> new RuntimeException("Pair not found"));

        ClassMember mentorMembership = classMemberRepository.findByUserIdAndCourseClassId(
                mentorUserId, studyGroup.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("You are not a mentor in this class"));

        if (!"MENTOR".equals(mentorMembership.getContextRole())) {
            throw new RuntimeException("You are not a mentor in this class");
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(pairId);

        List<Long> memberIds = groupMembers.stream()
                .map(gm -> gm.getClassMember().getId())
                .collect(Collectors.toList());

        List<Submission> submissions = memberIds.isEmpty()
                ? List.of()
                : submissionRepository.findByMemberIds(memberIds);

        String courseName = studyGroup.getCourseClass() != null
                && studyGroup.getCourseClass().getCourse() != null
                        ? studyGroup.getCourseClass().getCourse().getTitle()
                        : null;
        String className = studyGroup.getCourseClass() != null ? studyGroup.getCourseClass().getName() : null;

        List<MentorPairSubmissionsResponse.SubmissionItem> items = submissions.stream()
                .map(s -> MentorPairSubmissionsResponse.SubmissionItem.builder()
                        .submissionId(s.getId())
                        .submitterId(s.getMember() != null && s.getMember().getUser() != null
                                ? s.getMember().getUser().getId()
                                : null)
                        .submitterName(s.getMember() != null && s.getMember().getUser() != null
                                ? s.getMember().getUser().getFullName()
                                : null)
                        .submitterAvatarUrl(
                                s.getMember() != null && s.getMember().getUser() != null
                                        ? s.getMember().getUser().getAvatarUrl()
                                        : null)
                        .assignmentId(s.getAssignment() != null ? s.getAssignment().getId()
                                : null)
                        .assignmentTitle(
                                s.getAssignment() != null ? s.getAssignment().getTitle()
                                        : null)
                        .moduleId(s.getAssignment() != null
                                && s.getAssignment().getModule() != null
                                        ? s.getAssignment().getModule().getId()
                                        : null)
                        .moduleTitle(s.getAssignment() != null
                                && s.getAssignment().getModule() != null
                                        ? s.getAssignment().getModule()
                                                .getTitle()
                                        : null)
                        .submissionContent(s.getSubmissionContent())
                        .status(s.getStatus())
                        .submittedAt(s.getSubmittedAt())
                        .build())
                .collect(Collectors.toList());

        return MentorPairSubmissionsResponse.builder()
                .pairId(studyGroup.getId())
                .pairName("Pair " + studyGroup.getId())
                .courseName(courseName)
                .className(className)
                .submissions(items)
                .build();
    }

    public MentorPairPeerReviewsResponse getPairPeerReviewsForMentor(Long pairId, Long mentorUserId) {
        StudyGroup studyGroup = studyGroupRepository.findById(pairId)
                .orElseThrow(() -> new RuntimeException("Pair not found"));

        ClassMember mentorMembership = classMemberRepository.findByUserIdAndCourseClassId(
                mentorUserId, studyGroup.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("You are not a mentor in this class"));

        if (!"MENTOR".equals(mentorMembership.getContextRole())) {
            throw new RuntimeException("You are not a mentor in this class");
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(pairId);

        List<Long> memberIds = groupMembers.stream()
                .map(gm -> gm.getClassMember().getId())
                .collect(Collectors.toList());

        List<PeerReview> peerReviews = memberIds.isEmpty()
                ? List.of()
                : peerReviewRepository.findByGroupMemberIds(memberIds);

        String courseName = studyGroup.getCourseClass() != null
                && studyGroup.getCourseClass().getCourse() != null
                        ? studyGroup.getCourseClass().getCourse().getTitle()
                        : null;
        String className = studyGroup.getCourseClass() != null ? studyGroup.getCourseClass().getName() : null;

        List<MentorPairPeerReviewsResponse.PeerReviewItem> items = peerReviews.stream()
                .map(pr -> {
                    ClassMember submitterMember = pr.getSubmission() != null
                            ? pr.getSubmission().getMember()
                            : null;
                    ClassMember reviewerMember = pr.getReviewer() != null
                            ? pr.getReviewer().getClassMember()
                            : null;

                    return MentorPairPeerReviewsResponse.PeerReviewItem.builder()
                            .peerReviewId(pr.getId())
                            .submissionId(pr.getSubmission() != null
                                    ? pr.getSubmission().getId()
                                    : null)
                            .submitterUserId(submitterMember != null
                                    && submitterMember.getUser() != null
                                            ? submitterMember.getUser()
                                                    .getId()
                                            : null)
                            .submitterName(submitterMember != null
                                    && submitterMember.getUser() != null
                                            ? submitterMember.getUser()
                                                    .getFullName()
                                            : null)
                            .submitterAvatarUrl(submitterMember != null
                                    && submitterMember.getUser() != null
                                            ? submitterMember.getUser()
                                                    .getAvatarUrl()
                                            : null)
                            .reviewerUserId(reviewerMember != null
                                    && reviewerMember.getUser() != null
                                            ? reviewerMember.getUser()
                                                    .getId()
                                            : null)
                            .reviewerName(reviewerMember != null
                                    && reviewerMember.getUser() != null
                                            ? reviewerMember.getUser()
                                                    .getFullName()
                                            : null)
                            .reviewerAvatarUrl(reviewerMember != null
                                    && reviewerMember.getUser() != null
                                            ? reviewerMember.getUser()
                                                    .getAvatarUrl()
                                            : null)
                            .assignmentId(pr.getSubmission() != null
                                    && pr.getSubmission().getAssignment() != null
                                            ? pr.getSubmission()
                                                    .getAssignment()
                                                    .getId()
                                            : null)
                            .assignmentTitle(pr.getSubmission() != null
                                    && pr.getSubmission().getAssignment() != null
                                            ? pr.getSubmission()
                                                    .getAssignment()
                                                    .getTitle()
                                            : null)
                            .moduleId(pr.getSubmission() != null
                                    && pr.getSubmission().getAssignment() != null
                                    && pr.getSubmission().getAssignment()
                                            .getModule() != null
                                                    ? pr.getSubmission()
                                                            .getAssignment()
                                                            .getModule()
                                                            .getId()
                                                    : null)
                            .moduleTitle(pr.getSubmission() != null
                                    && pr.getSubmission().getAssignment() != null
                                    && pr.getSubmission().getAssignment()
                                            .getModule() != null
                                                    ? pr.getSubmission()
                                                            .getAssignment()
                                                            .getModule()
                                                            .getTitle()
                                                    : null)
                            .criteriaScores(pr.getCriteriaScores())
                            .finalScore(pr.getFinalScore())
                            .comments(pr.getComments())
                            .isOverridden(pr.isOverridden())
                            .reviewAt(pr.getReviewAt())
                            .build();
                })
                .collect(Collectors.toList());

        return MentorPairPeerReviewsResponse.builder()
                .pairId(studyGroup.getId())
                .pairName("Pair " + studyGroup.getId())
                .courseName(courseName)
                .className(className)
                .peerReviews(items)
                .build();
    }

    public ClassLeaderboardResponse getClassLeaderboard(Long classId, Long currentUserId) {
        CourseClass cc = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        Long courseId = cc.getCourse().getId();

        // 1. Get all active learners in class
        List<ClassMember> learners = classMemberRepository.findByCourseClassIdAndContextRole(classId, "LEARNER")
                .stream()
                .filter(cm -> cm.getLearnerStatus() == org.eduspace.backend.enums.LearnerStatus.ACTIVE)
                .collect(Collectors.toList());

        // Calculate progress for each learner and build IndividualEntry list
        List<ClassLeaderboardResponse.IndividualEntry> individuals = new ArrayList<>();
        for (ClassMember cm : learners) {
            double progressPercentage = progressService.getLearnerProgressPercentage(cm.getId(), courseId);
            individuals.add(ClassLeaderboardResponse.IndividualEntry.builder()
                    .userId(cm.getUser().getId())
                    .name(cm.getUser().getFullName() != null ? cm.getUser().getFullName() : cm.getUser().getUsername())
                    .avatar(cm.getUser().getAvatarUrl())
                    .progress((int) Math.round(progressPercentage))
                    .isSelf(cm.getUser().getId().equals(currentUserId))
                    .build());
        }

        // Sort individuals by progress descending
        individuals.sort((a, b) -> Integer.compare(b.getProgress(), a.getProgress()));
        // Set rank for each individual
        for (int i = 0; i < individuals.size(); i++) {
            individuals.get(i).setRank(i + 1);
        }

        // 2. Get study groups (pairs) in class
        List<StudyGroup> groups = studyGroupRepository.findByCourseClassId(classId);
        List<ClassLeaderboardResponse.PairEntry> pairs = new ArrayList<>();

        for (StudyGroup g : groups) {
            List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(g.getId());
            List<String> avatars = new ArrayList<>();
            double sumProgress = 0.0;
            int memberCount = 0;
            boolean pairIsSelf = false;

            List<String> memberNames = new ArrayList<>();
            for (GroupMember gm : groupMembers) {
                ClassMember cm = gm.getClassMember();
                avatars.add(cm.getUser().getAvatarUrl());
                memberNames.add(
                        cm.getUser().getFullName() != null ? cm.getUser().getFullName() : cm.getUser().getUsername());
                double progressPercentage = progressService.getLearnerProgressPercentage(cm.getId(), courseId);
                sumProgress += progressPercentage;
                memberCount++;
                if (cm.getUser().getId().equals(currentUserId)) {
                    pairIsSelf = true;
                }
            }

            int avgProgress = memberCount > 0 ? (int) Math.round(sumProgress / memberCount) : 0;
            String pairName = "Cặp #" + g.getId();
            if (memberNames.size() == 1) {
                pairName = memberNames.get(0) + " (Độc hành)";
            } else if (memberNames.size() >= 2) {
                pairName = String.join(" & ", memberNames);
            }

            pairs.add(ClassLeaderboardResponse.PairEntry.builder()
                    .studyGroupId(g.getId())
                    .name(pairName)
                    .avatars(avatars)
                    .progress(avgProgress)
                    .isSelf(pairIsSelf)
                    .build());
        }

        // Sort pairs by progress descending
        pairs.sort((a, b) -> Integer.compare(b.getProgress(), a.getProgress()));
        // Set rank for each pair
        for (int i = 0; i < pairs.size(); i++) {
            pairs.get(i).setRank(i + 1);
        }

        return ClassLeaderboardResponse.builder()
                .individual(individuals)
                .pairs(pairs)
                .build();
    }
}
