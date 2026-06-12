package org.eduspace.backend.repository;

import org.eduspace.backend.entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaitlistEntryRepository extends JpaRepository<WaitlistEntry, Long> {

    @Query("SELECT COUNT(we) > 0 FROM WaitlistEntry we " +
            "JOIN we.waitlist w " +
            "WHERE w.course.id = :courseId AND we.user.id = :userId AND w.status = 'OPENING'")
    boolean isUserAlreadyWaiting(@Param("courseId") Long courseId, @Param("userId") Long userId);

    int countByWaitlistId(Long waitlistId);

    List<WaitlistEntry> findByWaitlistId(Long waitlistId);
}
