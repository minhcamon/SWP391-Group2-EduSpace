package org.eduspace.backend.repository;

import org.eduspace.backend.entity.RescueRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface RescueRequestRepository extends JpaRepository<RescueRequest, Long> {
    @Query("SELECT r FROM RescueRequest r WHERE r.incident.resolvedBy.user.id = :mentorUserId ORDER BY r.rescueDeadline ASC")
    List<RescueRequest> findByMentorUserId(@Param("mentorUserId") Long mentorUserId);
}
