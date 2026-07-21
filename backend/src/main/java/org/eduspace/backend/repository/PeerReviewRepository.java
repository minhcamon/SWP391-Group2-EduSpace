package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.PeerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PeerReviewRepository extends JpaRepository<PeerReview, Long> {
    Optional<PeerReview> findBySubmission_Id(Long submissionId);
    Optional<PeerReview> findByReviewer_ClassMember_IdAndSubmission_Assignment_Id(Long reviewerClassMemberId, Long assignmentId);

    @Query("SELECT pr FROM PeerReview pr WHERE " +
           "pr.submission.member.id IN :memberIds OR " +
           "pr.reviewer.classMember.id IN :memberIds")
    List<PeerReview> findByGroupMemberIds(@Param("memberIds") List<Long> memberIds);

    @Query("SELECT COUNT(pr) FROM PeerReview pr WHERE pr.reviewer.classMember.id = :classMemberId AND pr.reviewAt IS NULL")
    long countPendingReviews(@Param("classMemberId") Long classMemberId);
}

