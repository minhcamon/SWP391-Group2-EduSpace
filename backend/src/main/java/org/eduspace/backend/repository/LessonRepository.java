package org.eduspace.backend.repository;

import java.util.List;

import org.eduspace.backend.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByModuleIdOrderBySortOrder(Long moduleId);
}
