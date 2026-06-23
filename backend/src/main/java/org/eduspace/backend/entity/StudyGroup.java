package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "study_groups")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudyGroup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_group_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id")
    private CourseClass courseClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "module_id")
    private CourseModule module;

    @Column(name = "chat_channel_id", length = 255)
    private String chatChannelId;

    // Trạng thái kênh chat (Ví dụ: ACTIVE, ARCHIVED)
    @Column(name = "chat_status", length = 50)
    private String chatStatus;
}
