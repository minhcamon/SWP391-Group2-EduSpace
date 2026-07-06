package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.eduspace.backend.enums.LearnerModuleStatus;

@Entity
@Table(name = "learner_modules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LearnerModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LearnerModuleStatus status = LearnerModuleStatus.ACTIVE;
}
