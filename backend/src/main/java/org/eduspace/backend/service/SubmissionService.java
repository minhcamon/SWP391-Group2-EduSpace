package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.enums.SubmissionStatus;

import java.time.LocalDateTime;

import org.eduspace.backend.dto.assignment.request.SubmitAssignmentRequest;
import org.eduspace.backend.dto.assignment.response.SubmissionResponseDTO;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassMemberRepository classMemberRepository;

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

        return SubmissionResponseDTO.builder()
            .id(savedSubmission.getId())
            .assignmentId(assignment.getId())
            .assignmentTitle(assignment.getTitle())
            .memberId(member.getId())
            .learnerName(member.getUser().getFullName())
            .submissionContent(savedSubmission.getSubmissionContent())
            .submittedAt(savedSubmission.getSubmittedAt())
            .status(savedSubmission.getStatus().name())
            .build();
    }
}
