package org.eduspace.backend.repository;

import org.eduspace.backend.entity.CreatorRequest;
import org.eduspace.backend.enums.CreatorRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.eduspace.backend.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreatorRequestRepository extends JpaRepository<CreatorRequest, Long> {
    List<CreatorRequest> findByStatus(CreatorRequestStatus status);

    Optional<CreatorRequest> findById(Long id);
    boolean existsByLearnerAndStatus(User learner, CreatorRequestStatus status);
}
