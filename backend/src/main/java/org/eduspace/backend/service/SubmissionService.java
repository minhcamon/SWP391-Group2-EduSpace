package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.learner.request.SubmitAssignmentRequest;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final ClassMemberRepository classMemberRepository;

    @Transactional
    public Submission submitAssignment(Long learnerId, SubmitAssignmentRequest request) {

        Submission submission = submissionRepository.findByMemberIdAndAssignmentId(learnerId, request.getAssignmentId())
                .orElse(new Submission());

        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment không tồn tại!"));

        ClassMember member = classMemberRepository.findById(learnerId)
                .orElseThrow(() -> new RuntimeException("Học viên không hợp lệ!"));

        submission.setAssignment(assignment);
        submission.setMember(member);

        submission.setSubmissionUrl(request.getSubmissionUrl());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus(SubmissionStatus.PENDING);

        return submissionRepository.save(submission);
    }
}