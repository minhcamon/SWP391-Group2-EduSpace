package org.eduspace.backend.repository;

import org.eduspace.backend.entity.Course;
import org.eduspace.backend.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query(value = "SELECT * FROM courses WHERE creator_id = :creatorId AND is_deleted = false", nativeQuery = true)
    List<Course> getCoursesByCreatorId(@Param("creatorId") Long creatorId);

    List<Course> findByIsDeletedFalse();

    List<Course> findByStatusAndIsDeletedFalse(CourseStatus status);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM Course c WHERE c.id = :courseId AND c.isDeleted = false")
    Optional<Course> findByIdForUpdate(@Param("courseId") Long courseId);
}
