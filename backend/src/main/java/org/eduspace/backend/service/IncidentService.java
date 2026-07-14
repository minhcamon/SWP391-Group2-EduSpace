package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.request.ResolveIncidentRequest;
import org.eduspace.backend.dto.incident.response.IncidentDetailResponse;
import org.eduspace.backend.dto.incident.response.IncidentListResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final ClassMemberRepository classMemberRepository;

    public List<IncidentListResponse> getIncidents(Long userId) {
        List<ClassMember> managedClasses = classMemberRepository.findByUserIdAndContextRole(userId, "MENTOR");
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
            isMentorOfClass = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .map(cm -> "MENTOR".equals(cm.getContextRole()))
                .orElse(false);
        }

        boolean isReporter = incident.getReporter() != null && incident.getReporter().getUser() != null
                && incident.getReporter().getUser().getId().equals(userId);

        if (!isMentorOfClass && !isReporter) {
            throw new RuntimeException("Incident not found or you don't have permission to access it");
        }

        return IncidentDetailResponse.builder()
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
                .solvedAt(incident.getSolvedAt())
                .build();
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
        ClassMember mentorClassMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this class"));

        if (!"MENTOR".equals(mentorClassMember.getContextRole())) {
            throw new RuntimeException("You do not have MENTOR role in this class");
        }

        incident.setResolvedBy(mentorClassMember);
        incident.setStatus(IncidentStatus.IN_PROGRESS);
        incidentRepository.save(incident);
    }

    public void resolveIncident(Long incidentId, Long userId, ResolveIncidentRequest request) {
        resolveIncidentInternal(incidentId, userId, request.getResolutionNote());
    }

    public void mediateIncident(Long incidentId, Long userId, ResolveIncidentRequest request) {
        resolveIncidentInternal(incidentId, userId, "Hòa giải: " + request.getResolutionNote());
    }

    public void warnIncident(Long incidentId, Long userId, ResolveIncidentRequest request) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incident.getStatus() != IncidentStatus.IN_PROGRESS) {
            throw new RuntimeException("Incident is not in IN_PROGRESS state");
        }

        String existingNote = incident.getResolutionNote() != null ? incident.getResolutionNote() : "";
        String warningLog = "Đã cảnh báo: " + request.getResolutionNote();
        incident.setResolutionNote(existingNote.isEmpty() ? warningLog : existingNote + " | " + warningLog);
        
        incidentRepository.save(incident);
    }

    private void resolveIncidentInternal(Long incidentId, Long userId, String resolutionNote) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        if (incident.getStatus() != IncidentStatus.IN_PROGRESS) {
            throw new RuntimeException("Incident is not in IN_PROGRESS state");
        }

        if (incident.getResolvedBy() == null || !incident.getResolvedBy().getUser().getId().equals(userId)) {
            throw new RuntimeException("You are not the mentor assigned to this incident");
        }

        incident.setStatus(IncidentStatus.RESOLVED);
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

