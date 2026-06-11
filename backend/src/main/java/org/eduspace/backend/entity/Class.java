package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "classes")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course; 

    @Column(name = "name", length = 100)
    private String name; 
    
    @Column(name = "activated_at")
    private LocalDateTime activatedAt; 

    @Column(name = "status")
    private String status; 
}