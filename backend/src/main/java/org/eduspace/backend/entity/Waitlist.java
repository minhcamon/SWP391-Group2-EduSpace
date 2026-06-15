package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import org.eduspace.backend.enums.WaitlistStatus;

@Data
@Entity
@Table(name = "waitlists")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Waitlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wait_list_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private WaitlistStatus status;
}
