package org.eduspace.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.eduspace.backend.entity.ClassTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassTimelineRepository extends JpaRepository<ClassTimeline, Long> {
    List<ClassTimeline> findByCourseClassId(Long classId);

    @Query("""
            SELECT ct.dueDate FROM ClassTimeline ct WHERE ct.courseClass.id = :classId AND ct.module.id = :moduleId
            """)
    LocalDateTime findByCourseClassIdAndModuleId(Long classId, Long moduleId);
}