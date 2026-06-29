package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "modules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(nullable = false)
    private String title;

    private Integer priority;

    @Column(name = "base_exp")
    private Integer baseExp;

    @Column(name = "speed_bonus_exp")
    private Integer speedBonusExp;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @OneToMany(mappedBy = "module", cascade = CascadeType.ALL)
    private List<Assignment> assignments;
}