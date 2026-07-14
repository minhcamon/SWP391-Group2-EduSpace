package org.eduspace.backend.repository;

import org.eduspace.backend.entity.ActiveMentor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ActiveMentorRepository extends JpaRepository<ActiveMentor, Long> {
    boolean existsByUserId(Long userId);
    long countByUserId(Long userId);
    boolean existsByUserIdAndCourseId(Long userId, Long courseId);
}

