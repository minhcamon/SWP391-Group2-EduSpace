package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.Role;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User recipient;

    @Column(nullable = false, length = 500)
    private String message;

    @Column(nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NotificationType type;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "target_role")
    private Role targetRole;
}
