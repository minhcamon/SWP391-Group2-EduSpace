package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.response.IncidentDetailResponse;
import org.eduspace.backend.dto.response.IncidentListResponse;
import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;

    public List<IncidentListResponse> getIncidents(Long userId) {
        List<Incident> incidents = incidentRepository.findByResolvedByUserId(userId);
        return incidents.stream().map(incident -> IncidentListResponse.builder()
                .id(incident.getId())
                .incidentType(incident.getIncidentType())
                .reporterName(incident.getReporter() != null && incident.getReporter().getUser() != null ? incident.getReporter().getUser().getFullName() : null)
                .reason(incident.getReason())
                .status(incident.getStatus())
                .createdAt(incident.getCreatedAt())
                .solvedAt(incident.getSolvedAt())
                .build()).toList();
    }

    public IncidentDetailResponse getIncidentDetail(Long incidentId, Long userId) {
        Incident incident = incidentRepository.findByIdAndResolvedByUserId(incidentId, userId);
        if (incident == null) {
            throw new RuntimeException("Incident not found or you don't have permission to access it");
        }
        
        return IncidentDetailResponse.builder()
                .id(incident.getId())
                .incidentType(incident.getIncidentType())
                .reporterName(incident.getReporter() != null && incident.getReporter().getUser() != null ? incident.getReporter().getUser().getFullName() : null)
                .reportedName(incident.getReported() != null && incident.getReported().getUser() != null ? incident.getReported().getUser().getFullName() : null)
                .reason(incident.getReason())
                .evidenceUrl(incident.getEvidenceUrl())
                .status(incident.getStatus())
                .resolvedByName(incident.getResolvedBy() != null && incident.getResolvedBy().getUser() != null ? incident.getResolvedBy().getUser().getFullName() : null)
                .resolutionNote(incident.getResolutionNote())
                .createdAt(incident.getCreatedAt())
                .solvedAt(incident.getSolvedAt())
                .build();
    }
}
