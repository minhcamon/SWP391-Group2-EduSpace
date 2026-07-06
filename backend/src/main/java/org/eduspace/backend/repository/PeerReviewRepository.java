package org.eduspace.backend.repository;

import java.util.Optional;

import org.eduspace.backend.entity.PeerReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PeerReviewRepository extends JpaRepository<PeerReview, Long> {
    Optional<PeerReview> findBySubmission_Id(Long submissionId);
}
