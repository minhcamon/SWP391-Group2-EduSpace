package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.enums.LearnerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

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
                              AND cm.contextRole = 'LEARNER'
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
                              AND cm.contextRole = 'LEARNER'
                        """)
        boolean existsEnrollment(
                        @Param("userId") Long userId,
                        @Param("courseId") Long courseId,
                        @Param("statuses") List<LearnerStatus> statuses);

        @Query("""
                            SELECT cm FROM ClassMember cm
                            WHERE cm.user.id = :userId
                              AND cm.courseClass.course.id = :courseId
                              AND cm.learnerStatus = :status
                        """)
        Optional<ClassMember> findActiveMember(
                        @Param("userId") Long userId,
                        @Param("courseId") Long courseId,
                        @Param("status") LearnerStatus status);

        long countByUserIdAndContextRole(Long userId, String contextRole);

        List<ClassMember> findByUserIdAndContextRole(Long userId, String contextRole);

        Optional<ClassMember> findByUserIdAndCourseClassIdAndContextRole(Long userId, Long classId, String contextRole);

        List<ClassMember> findByCourseClassIdAndContextRole(Long classId, String contextRole);

        Optional<ClassMember> findByCourseClassIdAndUserIdAndContextRole(Long classId, Long userId, String contextRole);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT cm FROM ClassMember cm WHERE cm.courseClass.id = :classId AND cm.user.id = :userId AND cm.contextRole = :contextRole")
        Optional<ClassMember> findByCourseClassIdAndUserIdAndContextRoleForWrite(
                        @Param("classId") Long classId,
                        @Param("userId") Long userId,
                        @Param("contextRole") String contextRole);

        @Query("SELECT COUNT(cm) FROM ClassMember cm WHERE cm.user.id = :mentorId AND cm.contextRole = 'MENTOR' AND cm.learnerStatus = 'ACTIVE'")
        long countActiveClassesForMentor(@Param("mentorId") Long mentorId);

        @Query("SELECT COUNT(cm) FROM ClassMember cm WHERE cm.courseClass.id = :classId AND cm.contextRole = 'MENTOR' AND cm.learnerStatus = 'ACTIVE'")
        long countActiveMentorsInClass(@Param("classId") Long classId);
}
