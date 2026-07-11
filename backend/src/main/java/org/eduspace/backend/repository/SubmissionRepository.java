package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.enums.SubmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    @Query("SELECT COUNT(DISTINCT s.assignment.id) FROM Submission s " +
            "WHERE s.member.id = :classMemberId " +
            "AND s.assignment.module.course.id = :courseId " +
            "AND s.status = :status")
    long countCompletedAssignments(@Param("classMemberId") Long classMemberId,
            @Param("courseId") Long courseId,
            @Param("status") SubmissionStatus status);

            
    @Query("SELECT s FROM Submission s WHERE s.member.id = :learnerId AND s.assignment.module.id = :moduleId")
    List<Submission> findByLearnerIdAndModuleId(@Param("learnerId") Long learnerId, @Param("moduleId") Long moduleId);


    Optional<Submission> findByMemberIdAndAssignmentId(Long learnerId, Long assignmentId);

    @Query("SELECT s FROM Submission s WHERE s.member.id IN :memberIds ORDER BY s.submittedAt DESC")
    List<Submission> findByMemberIds(@Param("memberIds") List<Long> memberIds);
}
