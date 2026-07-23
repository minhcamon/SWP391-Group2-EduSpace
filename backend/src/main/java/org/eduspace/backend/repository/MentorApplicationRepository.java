package org.eduspace.backend.repository;

import org.eduspace.backend.entity.MentorApplication;
import org.eduspace.backend.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorApplicationRepository extends JpaRepository<MentorApplication, Long> {
    List<MentorApplication> findByCourseCreatorIdOrderByIdDesc(Long creatorId);
    boolean existsByUserIdAndCourseIdAndStatus(Long userId, Long courseId, RequestStatus status);
}
