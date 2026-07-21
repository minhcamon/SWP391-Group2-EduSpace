package org.eduspace.backend.repository;

import org.eduspace.backend.entity.ActiveMentor;
import org.eduspace.backend.enums.MentorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ActiveMentorRepository extends JpaRepository<ActiveMentor, Long> {
    boolean existsByUserId(Long userId);
    long countByUserId(Long userId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
    List<ActiveMentor> findByUserId(Long userId);
    List<ActiveMentor> findByCourseId(Long courseId);
    Optional<ActiveMentor> findByUserIdAndCourseId(Long userId, Long courseId);
    List<ActiveMentor> findByCourseIdAndMentorStatusOrderByUpdatedAtAsc(Long courseId, MentorStatus status);
}
