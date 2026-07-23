package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.request.LearnerMentorSupportRequest;
import org.eduspace.backend.dto.incident.response.LearnerMentorSupportResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.entity.RescueRequest;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.RescueStatus;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.eduspace.backend.repository.RescueRequestRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LearnerMentorSupportService {

    private final ClassMemberRepository classMemberRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final IncidentRepository incidentRepository;
    private final RescueRequestRepository rescueRequestRepository;
    private final SubmissionRepository submissionRepository;

    @Transactional
    public LearnerMentorSupportResponse createMentorSupportRequest(Long learnerUserId,
            LearnerMentorSupportRequest request) {
        if (request.getIncidentType() == IncidentType.RESCUE_SUPPORT_REQUEST) {
            return createRescueSupportRequest(learnerUserId, request);
        }

        if (request.getIncidentType() == IncidentType.INACTIVE_PARTNER) {
            return createReportPartnerRequest(learnerUserId, request);
        }

        return createGeneralIncidentRequest(learnerUserId, request);
    }

    private LearnerMentorSupportResponse createRescueSupportRequest(Long learnerUserId,
            LearnerMentorSupportRequest request) {
        if (request.getCourseId() == null) {
            throw new RuntimeException("Course ID is required for rescue support request");
        }

        ClassMember learnerMember = classMemberRepository.findActiveEnrollment(
                learnerUserId,
                request.getCourseId(),
                LearnerStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("You are not an active learner in this course"));

        Incident incident = Incident.builder()
                .incidentType(IncidentType.RESCUE_SUPPORT_REQUEST)
                .reporter(learnerMember)
                .reason(request.getReason())
                .evidenceUrl(request.getEvidenceUrl())
                .status(IncidentStatus.PENDING)
                .build();

        Incident savedIncident = incidentRepository.save(incident);

        LocalDateTime now = LocalDateTime.now();
        RescueRequest rescueRequest = RescueRequest.builder()
                .incident(savedIncident)
                .learner(learnerMember)
                .rescueStartedAt(now)
                .rescueDeadline(now.plusHours(48))
                .status(RescueStatus.PENDING)
                .build();

        rescueRequestRepository.save(rescueRequest);

        return LearnerMentorSupportResponse.builder()
                .incidentId(savedIncident.getId())
                .incidentType(savedIncident.getIncidentType())
                .incidentStatus(savedIncident.getStatus())
                .rescueDeadline(rescueRequest.getRescueDeadline())
                .build();
    }

    private LearnerMentorSupportResponse createReportPartnerRequest(Long learnerUserId,
            LearnerMentorSupportRequest request) {
        if (request.getStudyGroupId() == null || request.getReportedUserId() == null) {
            throw new RuntimeException("Study group ID and reported user ID are required for report partner request");
        }

        GroupMember reporterGroupMember = groupMemberRepository.findByStudyGroupIdAndClassMemberUserId(
                request.getStudyGroupId(), learnerUserId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this study group"));

        if (request.getReportedUserId().equals(learnerUserId)) {
            throw new RuntimeException("You cannot report yourself");
        }

        GroupMember reportedGroupMember = groupMemberRepository.findByStudyGroupIdAndClassMemberUserId(
                request.getStudyGroupId(), request.getReportedUserId())
                .orElseThrow(() -> new RuntimeException("Reported user is not a member of this study group"));

        Incident incident = Incident.builder()
                .incidentType(IncidentType.INACTIVE_PARTNER)
                .reporter(reporterGroupMember.getClassMember())
                .reported(reportedGroupMember.getClassMember())
                .reason(request.getReason())
                .evidenceUrl(request.getEvidenceUrl())
                .status(IncidentStatus.PENDING)
                .build();

        Incident savedIncident = incidentRepository.save(incident);

        return LearnerMentorSupportResponse.builder()
                .incidentId(savedIncident.getId())
                .incidentType(savedIncident.getIncidentType())
                .incidentStatus(savedIncident.getStatus())
                .build();
    }

    private LearnerMentorSupportResponse createGeneralIncidentRequest(Long learnerUserId,
            LearnerMentorSupportRequest request) {
        if (request.getCourseId() == null) {
            throw new RuntimeException("Course ID is required for this incident type");
        }

        ClassMember learnerMember = classMemberRepository.findActiveEnrollment(
                learnerUserId,
                request.getCourseId(),
                LearnerStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("You are not an active learner in this course"));

        ClassMember reportedMember = null;
        if (request.getReportedUserId() != null) {
            reportedMember = classMemberRepository.findByUserIdAndCourseClassId(
                    request.getReportedUserId(),
                    learnerMember.getCourseClass().getId())
                    .orElseThrow(() -> new RuntimeException("Reported user is not a member of this class"));
        }

        Submission submission = null;
        if (request.getSubmissionId() != null) {
            submission = submissionRepository.findById(request.getSubmissionId())
                    .orElseThrow(() -> new RuntimeException("Submission not found"));
        }

        Incident incident = Incident.builder()
                .incidentType(request.getIncidentType())
                .reporter(learnerMember)
                .reported(reportedMember)
                .submission(submission)
                .reason(request.getReason())
                .evidenceUrl(request.getEvidenceUrl())
                .status(IncidentStatus.PENDING)
                .build();

        Incident savedIncident = incidentRepository.save(incident);

        return LearnerMentorSupportResponse.builder()
                .incidentId(savedIncident.getId())
                .incidentType(savedIncident.getIncidentType())
                .incidentStatus(savedIncident.getStatus())
                .build();
    }
}
