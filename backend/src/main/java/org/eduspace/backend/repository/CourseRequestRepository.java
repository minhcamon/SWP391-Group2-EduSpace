package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.CourseRequest;
import org.eduspace.backend.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRequestRepository extends JpaRepository<CourseRequest, Long> {

    @Query("SELECT cr FROM CourseRequest cr " +
            "JOIN FETCH cr.course c " +
            "JOIN FETCH c.creator " +
            "WHERE cr.adminId = :adminId")
    List<CourseRequest> getHistoryCourseRequestsByAdminId(@Param("adminId") Long adminId);

    @Query("SELECT cr FROM CourseRequest cr WHERE cr.course.id = :courseId AND cr.status = :status ORDER BY cr.createdAt DESC")
    List<CourseRequest> findByCourseIdAndStatusOrderByCreatedAtDesc(
            @Param("courseId") Long courseId,
            @Param("status") RequestStatus status);
}