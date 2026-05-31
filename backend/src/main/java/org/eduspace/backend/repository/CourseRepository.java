package org.eduspace.backend.repository;

import org.eduspace.backend.entity.Course;
import org.eduspace.backend.enums.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query(value = "SELECT * FROM courses WHERE user_id = :creatorId AND is_deleted = false", nativeQuery = true)
    List<Course> getCoursesByCreatorId(@Param("creatorId") Long creatorId);

    List<Course> findByIsDeletedFalse();
    List<Course> findByStatusAndIsDeletedFalse(CourseStatus status);
}
