package org.eduspace.backend.repository;

import java.util.Optional;

import org.eduspace.backend.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findByModuleId(Long moduleId);
}
