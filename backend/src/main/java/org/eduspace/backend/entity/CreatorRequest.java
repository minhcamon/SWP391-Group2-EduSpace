package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.RequestStatus;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "creator_requests")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreatorRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "creator_request_id")
    private Long id;

    @Column(name = "document_urls", columnDefinition = "LONGTEXT")
    private String documentUrl;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User learner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;
}
