package org.eduspace.backend.repository;

import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.entity.WaitlistEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WaitlistEntryRepository extends JpaRepository<WaitlistEntry, Long> {

    // Thêm câu Query này vào file của em để check xem User đã nằm trong hàng chờ OPENING nào chưa
    @Query("SELECT COUNT(we) > 0 FROM WaitlistEntry we " +
           "JOIN we.waitlist w " +
           "WHERE w.course.id = :courseId AND we.user.id = :userId AND w.status = 'OPENING'")
    boolean isUserAlreadyWaiting(@Param("courseId") Long courseId, @Param("userId") Long userId);

    // Thêm luôn câu Query này để đếm số lượng người trong đợt đó nhé
    int countByWaitlistId(Long waitlistId);
}
