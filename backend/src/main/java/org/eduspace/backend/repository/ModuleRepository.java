package org.eduspace.backend.repository;

import org.eduspace.backend.entity.CourseModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<CourseModule, Long> {
}
