package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "timelines")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClassTimeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "timeline_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private CourseModule module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private CourseClass courseClass;

    @Column(name = "due_date")
    private LocalDateTime dueDate;
}
