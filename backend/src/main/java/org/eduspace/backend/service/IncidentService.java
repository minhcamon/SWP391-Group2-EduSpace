package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.request.ResolveIncidentRequest;
import org.eduspace.backend.dto.incident.response.IncidentDetailResponse;
import org.eduspace.backend.dto.incident.response.IncidentListResponse;
import org.eduspace.backend.dto.course.RubricCriteriaDto;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.entity.PeerReview;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.eduspace.backend.repository.PeerReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final ClassMemberRepository classMemberRepository;
    private final SubmissionRepository submissionRepository;
    private final PeerReviewRepository peerReviewRepository;

    public List<IncidentListResponse> getIncidents(Long userId) {
        // Find classes where user is MENTOR or CREATOR (acting as mentor)
        List<ClassMember> managedClasses = classMemberRepository.findByUserIdAndContextRoleIn(userId,
                Arrays.asList("MENTOR", "CREATOR"));
        if (managedClasses.isEmpty()) {
            return List.of();
        }

        List<Long> classIds = managedClasses.stream()
                .map(cm -> cm.getCourseClass().getId())
                .toList();

        List<Incident> incidents = incidentRepository.findByReporterCourseClassIds(classIds);
        return incidents.stream().map(this::toListResponse).toList();
    }

    public List<IncidentListResponse> getMyIncidents(Long userId) {
        List<Incident> incidents = incidentRepository.findByReporterUserId(userId);
        return incidents.stream().map(this::toListResponse).toList();
    }

    public IncidentDetailResponse getIncidentDetail(Long incidentId, Long userId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        boolean isMentorOfClass = false;
        if (incident.getReporter() != null && incident.getReporter().getCourseClass() != null) {
            Long classId = incident.getReporter().getCourseClass().getId();
            // Check if user is MENTOR or CREATOR (acting as mentor) in this class
            isMentorOfClass = classMemberRepository.findByUserIdAndCourseClassIdAndContextRoleIn(
                    userId, classId, Arrays.asList("MENTOR", "CREATOR"))
                    .isPresent();
        }

        boolean isReporter = incident.getReporter() != null && incident.getReporter().getUser() != null
                && incident.getReporter().getUser().getId().equals(userId);

        if (!isMentorOfClass && !isReporter) {
            throw new RuntimeException("Incident not found or you don't have permission to access it");
        }

        IncidentDetailResponse.IncidentDetailResponseBuilder builder = IncidentDetailResponse.builder()
                .id(incident.getId())
                .incidentType(incident.getIncidentType())
                .reporterName(incident.getReporter() != null && incident.getReporter().getUser() != null
                        ? incident.getReporter().getUser().getFullName()
                        : null)
                .reportedName(incident.getReported() != null && incident.getReported().getUser() != null
                        ? incident.getReported().getUser().getFullName()
                        : null)
                .reason(incident.getReason())
                .evidenceUrl(incident.getEvidenceUrl())
                .status(incident.getStatus())
                .resolvedByName(incident.getResolvedBy() != null
                        && incident.getResolvedBy().getUser() != null
                                ? incident.getResolvedBy().getUser().getFullName()
                                : null)
                .resolutionNote(incident.getResolutionNote())
                .createdAt(incident.getCreatedAt())
                .solvedAt(incident.getSolvedAt());

        if (incident.getIncidentType() == IncidentType.ASSIGNMENT_DISPUTE) {
            enrichAssignmentDispute(builder, incident);
        }

        return builder.build();
    }

    private void enrichAssignmentDispute(IncidentDetailResponse.IncidentDetailResponseBuilder builder,
            Incident incident) {
        Submission submission = incident.getSubmission();
        if (submission != null) {
            builder.submissionContent(submission.getSubmissionContent());
            if (submission.getAssignment() != null) {
                builder.submissionTitle(submission.getAssignment().getTitle());
            }
            PeerReview peerReview = peerReviewRepository.findBySubmission_Id(submission.getId()).orElse(null);
            if (peerReview != null) {
                builder.scoreGiven(peerReview.getFinalScore());
                builder.reviewerComment(peerReview.getComments());
                builder.rubricCriteria(peerReview.getCriteriaScores());
            }
        }
    }

    private IncidentListResponse toListResponse(Incident incident) {
        return IncidentListResponse.builder()
                .id(incident.getId())
                .incidentType(incident.getIncidentType())
                .reporterName(incident.getReporter() != null && incident.getReporter().getUser() != null
                        ? incident.getReporter().getUser().getFullName()
                        : null)
                .reason(incident.getReason())
                .status(incident.getStatus())
                .createdAt(incident.getCreatedAt())
                .solvedAt(incident.getSolvedAt())
                .build();
    }

    public void acceptIncident(Long incidentId, Long userId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incident.getStatus() != IncidentStatus.PENDING) {
            throw new RuntimeException("Incident is not in PENDING state");
        }

        Long classId = incident.getReporter().getCourseClass().getId();
        // Allow both MENTOR and CREATOR to accept incidents
        ClassMember mentorClassMember = classMemberRepository.findByUserIdAndCourseClassIdAndContextRoleIn(
                userId, classId, Arrays.asList("MENTOR", "CREATOR"))
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp này"));

        if (!"MENTOR".equals(mentorClassMember.getContextRole())
                && !"CREATOR".equals(mentorClassMember.getContextRole())) {
            throw new RuntimeException("You do not have MENTOR or CREATOR role in this class");
        }

        incident.setResolvedBy(mentorClassMember);
        incident.setStatus(IncidentStatus.IN_PROGRESS);
        incidentRepository.save(incident);
    }

    @Transactional
    public void resolveIncident(Long incidentId, Long userId, ResolveIncidentRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incident.getStatus() != IncidentStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Incident is not in IN_PROGRESS state");
        }

        if (incident.getResolvedBy() == null || !incident.getResolvedBy().getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not the mentor assigned to this incident");
        }

        if (request.getCriteriaScores() != null && incident.getIncidentType() != IncidentType.ASSIGNMENT_DISPUTE) {
            throw new IllegalArgumentException("Criteria scores are only allowed for ASSIGNMENT_DISPUTE incidents");
        }

        if (incident.getIncidentType() == IncidentType.ASSIGNMENT_DISPUTE && request.getCriteriaScores() != null) {
            regradeAssignmentInternal(incident, request);
        } else {
            resolveGenericInternal(incident, request.getResolutionNote());
        }
    }

    @Transactional
    public void rejectIncident(Long incidentId, Long userId, ResolveIncidentRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incident.getStatus() != IncidentStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Incident is not in IN_PROGRESS state");
        }

        if (incident.getResolvedBy() == null || !incident.getResolvedBy().getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not the mentor assigned to this incident");
        }

        finalizeIncidentStatus(incident, IncidentStatus.REJECTED, "Từ chối phân xử: " + request.getResolutionNote());
    }

    @Transactional
    public void warnIncident(Long incidentId, Long userId, ResolveIncidentRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incident.getStatus() != IncidentStatus.IN_PROGRESS) {
            throw new IllegalArgumentException("Incident is not in IN_PROGRESS state");
        }

        if (incident.getResolvedBy() == null || !incident.getResolvedBy().getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not the mentor assigned to this incident");
        }

        String existingNote = incident.getResolutionNote() != null ? incident.getResolutionNote() : "";
        String warningLog = "Đã nhắc nhở: " + request.getResolutionNote();
        incident.setResolutionNote(existingNote.isEmpty() ? warningLog : existingNote + " | " + warningLog);

        incidentRepository.save(incident);
    }

    private void regradeAssignmentInternal(Incident incident, ResolveIncidentRequest request) {
        Submission submission = incident.getSubmission();
        if (submission == null) {
            throw new RuntimeException("Yêu cầu phân xử không đi kèm bài nộp nào để chấm điểm");
        }

        PeerReview peerReview = peerReviewRepository.findBySubmission_Id(submission.getId())
                .orElse(null);

        if (peerReview == null) {
            peerReview = PeerReview.builder()
                    .submission(submission)
                    .build();
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
        double passThreshold = 0.8;
        submission.setStatus(passRatio >= passThreshold ? SubmissionStatus.GRADED : SubmissionStatus.FAILED);

        peerReview.setCriteriaScores(criteriaScores);
        peerReview.setFinalScore(totalScore);
        peerReview.setComments(request.getResolutionNote());
        peerReview.setReviewAt(LocalDateTime.now());
        peerReview.setOverridden(true);

        peerReviewRepository.save(peerReview);
        submissionRepository.save(submission);

        finalizeIncidentStatus(incident, IncidentStatus.RESOLVED,
                "Mentor chấm lại bài: " + request.getResolutionNote());
    }

    private void resolveGenericInternal(Incident incident, String resolutionNote) {
        finalizeIncidentStatus(incident, IncidentStatus.RESOLVED, resolutionNote);
    }

    private void finalizeIncidentStatus(Incident incident, IncidentStatus status, String resolutionNote) {
        incident.setStatus(status);
        incident.setResolutionNote(resolutionNote);
        incident.setSolvedAt(LocalDateTime.now());
        incidentRepository.save(incident);
    }

    public List<IncidentListResponse> getIncidentHistory(Long userId) {
        List<Incident> incidents = incidentRepository.findByResolvedByUserIdAndStatus(userId,
                IncidentStatus.RESOLVED);
        return incidents.stream().map(incident -> IncidentListResponse.builder()
                .id(incident.getId())
                .incidentType(incident.getIncidentType())
                .reporterName(incident.getReporter() != null && incident.getReporter().getUser() != null
                        ? incident.getReporter().getUser().getFullName()
                        : null)
                .reason(incident.getReason())
                .status(incident.getStatus())
                .createdAt(incident.getCreatedAt())
                .solvedAt(incident.getSolvedAt())
                .build()).toList();
    }
}
