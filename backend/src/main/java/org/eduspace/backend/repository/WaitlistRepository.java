package org.eduspace.backend.repository;

import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.enums.WaitlistStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
        Optional<Long> findWaitlistByUserAndCourse(@Param("userId") Long userId, @Param("courseId") Long courseId);

    
        @Query("""
                            SELECT we.user
                            FROM WaitlistEntry we
                            WHERE we.waitlist.id = :waitlistId
                            ORDER BY we.enrolledAt ASC
                        """)
        List<User> findUsersByWaitListId(@Param("waitlistId") Long waitlistId);

    
        Optional<Waitlist> findByCourseIdAndStatus(Long courseId, WaitlistStatus status);

        @Modifying
        @Query("""
                        DELETE FROM WaitlistEntry we
                        WHERE we.user.id = :userId
                        AND we.waitlist.id = :waitlistId
                        """)
        int deleteEntryByUserAndWaitlist(@Param("userId") Long userId, @Param("waitlistId") Long waitlistId);
}
