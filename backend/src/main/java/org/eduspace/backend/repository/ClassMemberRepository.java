package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.enums.LearnerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassMemberRepository extends JpaRepository<ClassMember, Long> {
    Optional<ClassMember> findByUserIdAndCourseClassId(Long userId, Long classId);

    List<ClassMember> findByUserId(Long userId);

    List<ClassMember> findByCourseClassId(Long classId);

    @Query("""
                SELECT cm FROM ClassMember cm
                WHERE cm.user.id = :userId
                  AND cm.courseClass.course.id = :courseId
                  AND cm.learnerStatus = :status
            """)
    Optional<ClassMember> findActiveEnrollment(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId,
            @Param("status") LearnerStatus status);

    @Query("""
                SELECT COUNT(cm) > 0 FROM ClassMember cm
                WHERE cm.user.id = :userId
                  AND cm.courseClass.course.id = :courseId
                  AND cm.learnerStatus IN :statuses
            """)
    boolean existsEnrollment(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId,
            @Param("statuses") List<LearnerStatus> statuses);

    long countByUserIdAndContextRole(Long userId, String contextRole);

    List<ClassMember> findByUserIdAndContextRole(Long userId, String contextRole);

    Optional<ClassMember> findByUserIdAndCourseClassIdAndContextRole(Long userId, Long classId, String contextRole);

    List<ClassMember> findByCourseClassIdAndContextRole(Long classId, String contextRole);
}