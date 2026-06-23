package org.eduspace.backend.repository;

import org.eduspace.backend.entity.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<CourseClass, Long> {
}
