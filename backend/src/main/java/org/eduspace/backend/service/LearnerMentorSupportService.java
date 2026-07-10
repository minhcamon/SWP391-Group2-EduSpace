package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.request.LearnerMentorSupportRequest;
import org.eduspace.backend.dto.incident.response.LearnerMentorSupportResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.entity.RescueRequest;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.RescueStatus;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.eduspace.backend.repository.RescueRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LearnerMentorSupportService {

    private final ClassMemberRepository classMemberRepository;
    private final IncidentRepository incidentRepository;
    private final RescueRequestRepository rescueRequestRepository;

    @Transactional
    public LearnerMentorSupportResponse createMentorSupportRequest(Long learnerUserId,
                                                                   LearnerMentorSupportRequest request) {
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
}
