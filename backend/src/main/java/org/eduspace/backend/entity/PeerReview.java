package org.eduspace.backend.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.eduspace.backend.dto.course.RubricCriteriaDto;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "peer_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeerReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private GroupMember reviewer;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "rubric_criteria", columnDefinition = "json")
    private List<RubricCriteriaDto> criteriaScores;

    @Column(name = "final_score")
    private Integer finalScore;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "is_overridden")
    private boolean isOverridden;

    @Column(name = "review_at")
    private LocalDateTime reviewAt;

}
