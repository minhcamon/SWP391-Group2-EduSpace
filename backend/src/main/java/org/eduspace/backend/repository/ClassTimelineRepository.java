package org.eduspace.backend.repository;

import java.util.List;

import org.eduspace.backend.entity.ClassTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassTimelineRepository extends JpaRepository<ClassTimeline, Long> {
    List<ClassTimeline> findByCourseClassId(Long classId);
}
