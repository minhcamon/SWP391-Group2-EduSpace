package org.eduspace.backend.entity;

import org.eduspace.backend.enums.LessonContentType;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "lessons")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id", nullable = false)
    private CourseModule module;

    @Column(nullable = false, length = 255)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "content_type", nullable = false)
    private LessonContentType contentType;

    @Column(name = "content_url", nullable = false, columnDefinition = "TEXT")
    private String contentUrl;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
}
