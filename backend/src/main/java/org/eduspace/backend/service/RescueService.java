package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.rescue.request.InitiateRescueRequest;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.entity.RescueRequest;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;
import org.eduspace.backend.enums.RescueStatus;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.eduspace.backend.repository.RescueRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RescueService {

    private final RescueRequestRepository rescueRequestRepository;
    private final IncidentRepository incidentRepository;
    private final ClassMemberRepository classMemberRepository;

    @Transactional
    public void initiateRescue(Long mentorUserId, InitiateRescueRequest request) {
        // 1. Validate Learner
        ClassMember learnerClassMember = classMemberRepository.findById(request.getLearnerClassMemberId())
                .orElseThrow(() -> new RuntimeException("Learner ClassMember not found"));

        Long classId = learnerClassMember.getCourseClass().getId();

        // 2. Validate Mentor has access to this class
        ClassMember mentorClassMember = classMemberRepository.findByUserIdAndCourseClassId(mentorUserId, classId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this class"));

        if (!"MENTOR".equals(mentorClassMember.getContextRole())) {
            throw new RuntimeException("You do not have MENTOR role in this class");
        }

        // 3. Create Incident first
        Incident incident = Incident.builder()
                .incidentType(IncidentType.RESCUE_SUPPORT_REQUEST)
                .reporter(learnerClassMember) // Treat learner as reporter conceptually
                .reason(request.getReason())
                .status(IncidentStatus.IN_PROGRESS)
                .resolvedBy(mentorClassMember) // Proactively assigned to this Mentor
                .build();
        
        Incident savedIncident = incidentRepository.save(incident);

        // 4. Create RescueRequest
        LocalDateTime now = LocalDateTime.now();
        RescueRequest rescueRequest = RescueRequest.builder()
                .incident(savedIncident)
                .learner(learnerClassMember)
                .rescueStartedAt(now)
                .rescueDeadline(now.plusHours(48))
                .status(RescueStatus.ON_GOING)
                .build();
        
        rescueRequestRepository.save(rescueRequest);
    }

    @Transactional
    public void closeRescue(Long rescueId, Long mentorUserId, org.eduspace.backend.dto.rescue.request.CloseRescueRequest request) {
        RescueRequest rescueRequest = rescueRequestRepository.findById(rescueId)
                .orElseThrow(() -> new RuntimeException("Rescue Request not found"));

        if (rescueRequest.getStatus() != RescueStatus.ON_GOING) {
            throw new RuntimeException("Rescue Request is not in ON_GOING state");
        }

        Incident incident = rescueRequest.getIncident();
        if (incident.getResolvedBy() == null || !incident.getResolvedBy().getUser().getId().equals(mentorUserId)) {
            throw new RuntimeException("You are not the mentor assigned to this Rescue Request");
        }

        if (Boolean.TRUE.equals(request.getIsSuccess())) {
            rescueRequest.setStatus(RescueStatus.SAVED);
        } else {
            rescueRequest.setStatus(RescueStatus.DROPPED);
        }
        rescueRequestRepository.save(rescueRequest);

        incident.setStatus(IncidentStatus.RESOLVED);
        incident.setResolutionNote(request.getNote());
        incident.setSolvedAt(LocalDateTime.now());
        incidentRepository.save(incident);
    }

    public List<org.eduspace.backend.dto.rescue.response.RescueListResponse> getMentorRescues(Long mentorUserId) {
        return rescueRequestRepository.findByMentorUserId(mentorUserId).stream().map(r -> {
            return org.eduspace.backend.dto.rescue.response.RescueListResponse.builder()
                .id(r.getId())
                .incidentId(r.getIncident() != null ? r.getIncident().getId() : null)
                .learnerClassMemberId(r.getLearner() != null ? r.getLearner().getId() : null)
                .learnerName(r.getLearner() != null && r.getLearner().getUser() != null ? r.getLearner().getUser().getFullName() : null)
                .reason(r.getIncident() != null ? r.getIncident().getReason() : null)
                .rescueStartedAt(r.getRescueStartedAt())
                .rescueDeadline(r.getRescueDeadline())
                .status(r.getStatus())
                .build();
        }).toList();
    }
}
