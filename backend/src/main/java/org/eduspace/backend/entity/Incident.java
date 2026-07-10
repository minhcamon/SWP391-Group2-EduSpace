package org.eduspace.backend.entity;

import java.time.LocalDateTime;

import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.IncidentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "incidents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "incident_type", nullable = false)
    private IncidentType incedentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private ClassMember reporter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_id")
    private ClassMember reported;

    @Column(name = "reason", nullable = false)
    private String reason;

    @Column(name = "evidence_url")
    private String evidenceUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resolved_by")
    private ClassMember resolvedBy;

    @Column(name = "resolution_note")
    private String resolutionNote;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "solved_at")
    private LocalDateTime solvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
