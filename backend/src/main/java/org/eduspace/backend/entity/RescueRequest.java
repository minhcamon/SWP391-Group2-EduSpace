package org.eduspace.backend.entity;

import java.time.LocalDateTime;

import org.eduspace.backend.enums.RescueStatus;

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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rescue_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescueRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "incident_id", nullable = false)
    private Incident incident;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learner_id", nullable = false)
    private ClassMember learner;

    // Thời điểm hệ thống kích hoạt cửa sổ cứu trợ (Rescue Window)
    @Column(name = "rescue_started_at", nullable = false)
    private LocalDateTime rescueStartedAt;

    // Hạn chót để học viên hoàn thành bài tập nộp bù (Thường là rescue_started_at +
    // 48 giờ)
    @Column(name = "rescue_deadline", nullable = false)
    private LocalDateTime rescueDeadline;

    @Enumerated(EnumType.STRING)
    @Column(name = "rescue_status", nullable = false)
    private RescueStatus status;
}
