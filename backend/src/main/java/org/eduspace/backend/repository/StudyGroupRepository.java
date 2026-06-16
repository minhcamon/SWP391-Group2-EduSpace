package org.eduspace.backend.repository;

import java.util.Optional;
import org.eduspace.backend.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
    Optional<StudyGroup> findByCourseClassIdAndModuleId(Long classId, Long moduleId);
}
