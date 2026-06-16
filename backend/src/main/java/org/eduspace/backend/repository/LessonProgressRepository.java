package org.eduspace.backend.repository;

import java.util.List;

import org.eduspace.backend.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
        List<LessonProgress> findByClassMemberIdAndLessonIdIn(Long classMemberId, List<Long> lessonIds);

        @Query("SELECT lp FROM LessonProgress lp " +
                        "WHERE lp.classMember.id = :partnerMemberId AND lp.lesson.module.id = :moduleId " +
                        "ORDER BY lp.completedAt DESC, lp.id DESC")
        List<LessonProgress> findLatestProgressByPartner(@Param("partnerMemberId") Long partnerMemberId,
                        @Param("moduleId") Long moduleId);

        @Query("SELECT lp FROM LessonProgress lp " +
                        "WHERE lp.classMember.id = :classMemberId " +
                        "ORDER BY lp.completedAt DESC, lp.id DESC")
        List<LessonProgress> findLatestProgressByUser(@Param("classMemberId") Long classMemberId);

        @Query("SELECT COUNT(lp) FROM LessonProgress lp " +
                        "WHERE lp.classMember.id = :classMemberId AND lp.lesson.module.id = :moduleId AND lp.isCompleted = true")
        long countCompletedLessonsByClassMemberIdAndModuleId(@Param("classMemberId") Long classMemberId,
                        @Param("moduleId") Long moduleId);

        @Query("SELECT lp.lesson.id FROM LessonProgress lp " +
                        "WHERE lp.classMember.id = :classMemberId AND lp.lesson.module.id = :moduleId AND lp.isCompleted = true")
        List<Long> findCompletedLessonIdsByClassMemberIdAndModuleId(@Param("classMemberId") Long classMemberId,
                        @Param("moduleId") Long moduleId);
}
