package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.SubmissionStatus;

import java.time.LocalDateTime;

import org.eduspace.backend.dto.assignment.request.SubmitAssignmentRequest;
import org.eduspace.backend.dto.assignment.response.SubmissionResponseDTO;
import org.eduspace.backend.dto.submission.request.PeerReviewGradeRequest;
import org.eduspace.backend.dto.submission.response.PeerReviewAssignmentResponse;
import org.eduspace.backend.dto.submission.response.PartnerSubmissionStatusResponse;
import org.eduspace.backend.dto.submission.response.SubmissionReviewResponse;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.dto.course.RubricCriteriaDto;
import org.eduspace.backend.entity.PeerReview;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.PeerReviewRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.eduspace.backend.repository.UserRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.eduspace.backend.enums.NotificationType;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassMemberRepository classMemberRepository;
    private final PeerReviewRepository peerReviewRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    @Lazy
    @Autowired
    private CertificateService certificateService;

    @Value("${app.peer-review.pass-ratio:0.8}")
    private double peerReviewPassRatio;

    @Transactional
    public SubmissionResponseDTO submitAssignment(Long classId, Long userId, SubmitAssignmentRequest request) {

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found!"));

        ClassMember member = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, userId, "LEARNER")
                .orElseThrow(() -> new RuntimeException("Invalid learner!"));

        Submission submission = Submission.builder()
                .assignment(assignment)
                .member(member)
                .submissionContent(request.getSubmissionContent())
                .submittedAt(LocalDateTime.now())
                .status(SubmissionStatus.SUBMITTED)
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        generatePeerReviewForSubmission(savedSubmission.getId());
        return SubmissionResponseDTO.builder()
                .id(savedSubmission.getId())
                .assignmentId(assignment.getId())
                .assignmentTitle(assignment.getTitle())
                .memberId(member.getId())
                .learnerName(member.getUser().getFullName())
                .submittedAt(savedSubmission.getSubmittedAt())
                .status(savedSubmission.getStatus().name())
                .build();
    }

    public SubmissionReviewResponse getSubmissionReview(Long classId, Long userId, Long assignmentId) {
        ClassMember classMember = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, userId, "LEARNER")
                .orElseThrow(() -> new RuntimeException("Invalid learner!"));

        Submission submission = submissionRepository
                .findByMemberIdAndAssignmentId(classMember.getId(), assignmentId)
                .orElseThrow(() -> new RuntimeException("Submission not found!"));

        PeerReview peerReview = peerReviewRepository.findBySubmission_Id(submission.getId())
                .orElse(null);

        return SubmissionReviewResponse.builder()
                .reviewId(peerReview != null ? peerReview.getId() : null)
                .submissionId(submission.getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .assignmentDescription(submission.getAssignment().getDescription())
                .submissionContent(submission.getSubmissionContent())
                .status(submission.getStatus().name())
                .submittedAt(submission.getSubmittedAt())
                .rubricCriterias(peerReview != null ? peerReview.getCriteriaScores() : null)
                .comments(peerReview != null ? peerReview.getComments() : null)
                .build();
    }

    public PeerReviewAssignmentResponse getAssignedPeerReview(Long classId, Long userId, Long assignmentId) {
        ClassMember reviewerMember = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, userId, "LEARNER")
                .orElseThrow(() -> new RuntimeException("Invalid learner!"));
        if (reviewerMember.getLearnerStatus() != LearnerStatus.ACTIVE) {
            throw new RuntimeException("Invalid learner!");
        }

        boolean hasSubmitted = submissionRepository.findByMemberIdAndAssignmentId(
                reviewerMember.getId(), assignmentId).isPresent();

        if (!hasSubmitted) {
            throw new RuntimeException(
                    "You must submit your assignment before viewing and grading others' assignments!");
        }

        PeerReview peerReview = peerReviewRepository.findByReviewer_ClassMember_IdAndSubmission_Assignment_Id(
                reviewerMember.getId(), assignmentId)
                .orElseThrow(() -> new RuntimeException("Peer review assignment not found!"));

        Submission submission = peerReview.getSubmission();
        ClassMember submitter = submission.getMember();
        Assignment assignment = submission.getAssignment();

        return PeerReviewAssignmentResponse.builder()
                .reviewId(peerReview.getId())
                .submissionId(submission.getId())
                .assignmentTitle(assignment.getTitle())
                .assignmentDescription(assignment.getDescription())
                .submissionContent(submission.getSubmissionContent())
                .submittedAt(submission.getSubmittedAt())
                .submitterId(submitter.getId())
                .submitterName(submitter.getUser().getFullName())
                .rubricCriterias(peerReview.getCriteriaScores() != null && !peerReview.getCriteriaScores().isEmpty()
                        ? peerReview.getCriteriaScores()
                        : assignment.getRubricCriteria())
                .build();
    }

    public PartnerSubmissionStatusResponse getPartnerSubmissionStatus(Long classId, Long userId, Long assignmentId) {
        ClassMember currentMember = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, userId, "LEARNER")
                .orElseThrow(() -> new RuntimeException("Invalid learner!"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found!"));
        if (assignment.getModule() == null) {
            throw new RuntimeException("Assignment module not found!");
        }

        List<org.eduspace.backend.entity.StudyGroup> studyGroups = groupMemberRepository
                .findStudyGroupsByMemberAndClassAndModuleOrderByNewest(
                        currentMember.getId(), classId, assignment.getModule().getId());
        if (studyGroups.isEmpty()) {
            return PartnerSubmissionStatusResponse.builder()
                    .submitted(false)
                    .build();
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroups.get(0).getId());
        Optional<ClassMember> partnerMember = groupMembers.stream()
                .map(GroupMember::getClassMember)
                .filter(member -> member != null && !member.getId().equals(currentMember.getId()))
                .findFirst();

        if (partnerMember.isEmpty()) {
            return PartnerSubmissionStatusResponse.builder()
                    .submitted(false)
                    .build();
        }

        ClassMember partner = partnerMember.get();
        Optional<Submission> partnerSubmission = submissionRepository
                .findByMemberIdAndAssignmentId(partner.getId(), assignmentId);

        return PartnerSubmissionStatusResponse.builder()
                .partnerId(partner.getUser() != null ? partner.getUser().getId() : null)
                .partnerName(partner.getUser() != null ? partner.getUser().getFullName() : null)
                .partnerAvatarUrl(partner.getUser() != null ? partner.getUser().getAvatarUrl() : null)
                .submitted(partnerSubmission.isPresent())
                .submittedAt(partnerSubmission.map(Submission::getSubmittedAt).orElse(null))
                .build();
    }

    @Transactional
    public SubmissionReviewResponse gradePeerReview(Long classId, Long userId, Long reviewId,
            PeerReviewGradeRequest request) {
        ClassMember reviewerMember = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, userId, "LEARNER")
                .orElseThrow(() -> new RuntimeException("Invalid learner!"));

        if (reviewerMember.getLearnerStatus() != LearnerStatus.ACTIVE) {
            throw new RuntimeException("Invalid learner!");
        }

        PeerReview peerReview = peerReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Peer review not found!"));

        if (peerReview.getReviewer() == null
                || peerReview.getReviewer().getClassMember() == null
                || !peerReview.getReviewer().getClassMember().getId().equals(reviewerMember.getId())) {
            throw new RuntimeException("You do not have permission to grade this assignment!");
        }

        Submission targetSubmission = peerReview.getSubmission();
        if (targetSubmission == null || targetSubmission.getAssignment() == null) {
            throw new RuntimeException("Invalid submission data!");
        }

        boolean hasSubmitted = submissionRepository.findByMemberIdAndAssignmentId(
                reviewerMember.getId(), targetSubmission.getAssignment().getId()).isPresent();

        if (!hasSubmitted) {
            throw new RuntimeException("You must submit your assignment before grading others' assignments!");
        }

        List<RubricCriteriaDto> criteriaScores = request.getCriteriaScores();
        int totalScore = 0;
        int maxPossibleScore = 0;
        if (criteriaScores != null) {
            totalScore = criteriaScores.stream()
                    .filter(Objects::nonNull)
                    .mapToInt(score -> Objects.requireNonNullElse(score.getScore(), 0))
                    .sum();

            maxPossibleScore = criteriaScores.stream()
                    .filter(Objects::nonNull)
                    .mapToInt(score -> Objects.requireNonNullElse(score.getMaxPoint(), 0))
                    .sum();
        }

        double passRatio = maxPossibleScore > 0 ? (double) totalScore / maxPossibleScore : 0.0;
        Submission submission = peerReview.getSubmission();
        submission.setStatus(
                passRatio >= peerReviewPassRatio ? SubmissionStatus.GRADED : SubmissionStatus.FAILED);

        peerReview.setCriteriaScores(criteriaScores);
        peerReview.setFinalScore(totalScore);
        peerReview.setComments(request.getComments());
        peerReview.setReviewAt(LocalDateTime.now());
        peerReview.setOverridden(false);

        PeerReview savedReview = peerReviewRepository.save(peerReview);
        submissionRepository.save(submission);

        SubmissionReviewResponse response = SubmissionReviewResponse.builder()
                .reviewId(savedReview.getId())
                .submissionId(savedReview.getSubmission().getId())
                .rubricCriterias(savedReview.getCriteriaScores())
                .comments(savedReview.getComments())
                .build();

        if (submission.getStatus() == SubmissionStatus.GRADED) {
            certificateService.checkAndIssueCertificate(submission.getMember());
        }
        certificateService.checkAndIssueCertificate(reviewerMember);

        notificationService.sendToUser(submission.getMember().getUser(),
                "Bài tập của bạn đã được chấm điểm bởi thành viên cùng nhóm!",
                NotificationType.PEER_REVIEW,
                savedReview.getId());

        // 1. Cộng EXP cho người nộp bài dựa trên finalScore
        User submitterUser = submission.getMember().getUser();
        int currentSubmitterExp = submitterUser.getTotalExp() != null ? submitterUser.getTotalExp() : 0;
        submitterUser.setTotalExp(currentSubmitterExp + totalScore);
        userRepository.save(submitterUser);

        // 2. Thưởng EXP cho người đi chấm bài (reviewer)
        User reviewerUser = reviewerMember.getUser();
        int currentReviewerExp = reviewerUser.getTotalExp() != null ? reviewerUser.getTotalExp() : 0;
        reviewerUser.setTotalExp(currentReviewerExp + 20);
        userRepository.save(reviewerUser);

        return response;
    }

    @Transactional
    public void generatePeerReviewForSubmission(Long submissionId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found!"));

        Optional<PeerReview> existing = peerReviewRepository.findBySubmission_Id(submission.getId());
        if (existing.isPresent())
            return;

        Assignment assignment = submission.getAssignment();
        if (assignment == null || assignment.getModule() == null)
            return;

        Long moduleId = assignment.getModule().getId();
        Long classMemberId = submission.getMember().getId();

        List<Long> studyGroupIdList = groupMemberRepository.findStudyGroupIdByMemberAndModule(classMemberId,
                moduleId);
        if (studyGroupIdList.isEmpty())
            return;

        Long studyGroupId = studyGroupIdList.get(0);
        List<GroupMember> members = groupMemberRepository.findByStudyGroupId(studyGroupId);
        if (members == null || members.isEmpty())
            return;

        members.sort(Comparator.comparing(GroupMember::getId));

        int ownerIndex = -1;
        for (int i = 0; i < members.size(); i++) {
            if (members.get(i).getClassMember().getId().equals(classMemberId)) {
                ownerIndex = i;
                break;
            }
        }
        if (ownerIndex == -1)
            return;

        GroupMember reviewer = null;
        if (members.size() == 2) {
            reviewer = members.get(1 - ownerIndex);
        } else if (members.size() == 3) {
            reviewer = members.get((ownerIndex + 1) % 3);
        } else {
            // fallback: assign first other member
            for (GroupMember gm : members) {
                if (!gm.getClassMember().getId().equals(classMemberId)) {
                    reviewer = gm;
                    break;
                }
            }
        }

        if (reviewer == null)
            return;

        PeerReview peerReview = PeerReview.builder()
                .submission(submission)
                .reviewer(reviewer)
                .criteriaScores(null)
                .finalScore(null)
                .comments(null)
                .isOverridden(false)
                .reviewAt(null)
                .build();

        peerReviewRepository.save(peerReview);
    }
}
