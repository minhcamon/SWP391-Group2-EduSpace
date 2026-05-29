package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.eduspace.backend.enums.ClassStatus;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "classes")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Long id;

    @Column(name = "name", columnDefinition = "TEXT", nullable = false)
    private String name;

    @Column(name = "activated_at")
    private LocalDateTime activatedAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ClassStatus status = ClassStatus.UPCOMING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;
}
