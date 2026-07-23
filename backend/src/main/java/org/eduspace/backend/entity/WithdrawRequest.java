package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.eduspace.backend.enums.WithdrawStatus;
import org.eduspace.backend.enums.WithdrawScenario;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdraw_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_member_id", nullable = false)
    private ClassMember classMember; // dòng ClassMember của mentor đang xin rút

    @Column(name = "reason", columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "expected_leave_date")
    private LocalDate expectedLeaveDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "scenario", nullable = false)
    private WithdrawScenario scenario; // snapshot tại thời điểm submit, không tính lại sau

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private WithdrawStatus status = WithdrawStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "replacement_member_id")
    private ClassMember replacementMember; // ClassMember mới sau handover/takeover

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
