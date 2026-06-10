package org.eduspace.backend.repository;

import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaitlistRepository extends JpaRepository<Waitlist, Long> {
    @Query("""
                SELECT we.waitlist.id
                FROM WaitlistEntry we
                WHERE we.user.id = :userId
                AND we.waitlist.course.id = :courseId
            """)
    Optional<Long> findWaitlistByUserAndCourse(Long userId, Long courseId);

    @Query("""
                SELECT we.user
                FROM WaitlistEntry we
                WHERE we.waitlist.id = :waitlistId
                ORDER BY we.enrolledAt ASC
            """)
    List<User> findUsersByWaitListId(Long waitlistId);
}
