package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.SubmissionStatus;

import java.time.LocalDateTime;

import org.eduspace.backend.dto.assignment.request.SubmitAssignmentRequest;
import org.eduspace.backend.dto.assignment.response.SubmissionResponseDTO;
import org.eduspace.backend.dto.submission.response.PeerReviewAssignmentResponse;
import org.eduspace.backend.dto.submission.response.SubmissionReviewResponse;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.PeerReview;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.PeerReviewRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
        private final ClassMemberRepository classMemberRepository;
        private final PeerReviewRepository peerReviewRepository;
        private final GroupMemberRepository groupMemberRepository;

    @Transactional
    public SubmissionResponseDTO submitAssignment(Long learnerId, SubmitAssignmentRequest request) {

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment không tồn tại!"));

        ClassMember member = classMemberRepository.findById(learnerId)
                .orElseThrow(() -> new RuntimeException("Học viên không hợp lệ!"));

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
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("Học viên không hợp lệ!"));

        Submission submission = submissionRepository.findByMemberIdAndAssignmentId(classMember.getId(), assignmentId)
                .orElseThrow(() -> new RuntimeException("Submission không tồn tại!"));

        PeerReview peerReview = peerReviewRepository.findBySubmission_Id(submission.getId())
                .orElseThrow(() -> new RuntimeException("Peer Review không tồn tại!"));

        return SubmissionReviewResponse.builder()
                .reviewId(peerReview.getId())
                .submissionId(submission.getId())
                .rubricCriterias(peerReview.getCriteriaScores())
                .comments(peerReview.getComments())
                .build();
    }

    public PeerReviewAssignmentResponse getAssignedPeerReview(Long classId, Long userId, Long assignmentId) {
        ClassMember reviewerMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("Học viên không hợp lệ!"));
        if(reviewerMember.getLearnerStatus() != LearnerStatus.ACTIVE) {
            throw new RuntimeException("Học viên không hợp lệ!");
        }
        PeerReview peerReview = peerReviewRepository.findByReviewer_ClassMember_IdAndSubmission_Assignment_Id(
                reviewerMember.getId(), assignmentId)
                .orElseThrow(() -> new RuntimeException("Peer Review assignment không tồn tại!"));

        Submission submission = peerReview.getSubmission();
        ClassMember submitter = submission.getMember();
        Assignment assignment = submission.getAssignment();

        return PeerReviewAssignmentResponse.builder()
                .reviewId(peerReview.getId())
                .submissionId(submission.getId())
                .submissionContent(submission.getSubmissionContent())
                .submittedAt(submission.getSubmittedAt())
                .submitterId(submitter.getId())
                .submitterName(submitter.getUser().getFullName())
                .rubricCriterias(assignment.getRubricCriteria())
                .build();
    }

        @Transactional
        public void generatePeerReviewForSubmission(Long submissionId) {
                Submission submission = submissionRepository.findById(submissionId)
                                .orElseThrow(() -> new RuntimeException("Submission không tồn tại!"));

                // already has peer review -> skip
                Optional<PeerReview> existing = peerReviewRepository.findBySubmission_Id(submission.getId());
                if (existing.isPresent()) return;

                Assignment assignment = submission.getAssignment();
                if (assignment == null || assignment.getModule() == null) return;

                Long moduleId = assignment.getModule().getId();
                Long classMemberId = submission.getMember().getId();

                Optional<Long> studyGroupIdOpt = groupMemberRepository.findStudyGroupIdByMemberAndModule(classMemberId, moduleId);
                if (studyGroupIdOpt.isEmpty()) return; // no group -> nothing to assign

                Long studyGroupId = studyGroupIdOpt.get();
                List<GroupMember> members = groupMemberRepository.findByStudyGroupId(studyGroupId);
                if (members == null || members.isEmpty()) return;

                // stable order
                members.sort(Comparator.comparing(GroupMember::getId));

                int ownerIndex = -1;
                for (int i = 0; i < members.size(); i++) {
                        if (members.get(i).getClassMember().getId().equals(classMemberId)) {
                                ownerIndex = i;
                                break;
                        }
                }
                if (ownerIndex == -1) return;

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

                if (reviewer == null) return;

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
