package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.eduspace.backend.enums.LearnerStatus;

@Data
@Entity
@Table(name = "class_members")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClassMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private CourseClass courseClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "context_role")
    private String contextRole;

    @Column(name = "learner_status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private LearnerStatus learnerStatus = LearnerStatus.ACTIVE;

    @Column(name = "rescue_started_at")
    private LocalDateTime rescueStartedAt;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;
}