package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.eduspace.backend.enums.ModulePriority;

@Data
@Entity
@Table(name = "modules")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseModule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")
    private Long id;

    @Column(name = "title", nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private ModulePriority priority;

    @Column(name = "days")
    private int days;

    @Column(name = "base_exp")
    private int baseExp;

    @Column(name = "speed_bonus_exp")
    private int speedBonusExp;

    @Column(name = "sort_order")
    private int sortOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;
}
