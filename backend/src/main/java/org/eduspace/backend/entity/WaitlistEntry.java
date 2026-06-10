package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import org.eduspace.backend.dto.course.RubricCriteriaDto;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "waitlist_entries")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WaitlistEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "waitlist_entry_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "waitlist_id")
    private Waitlist waitlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;
}
