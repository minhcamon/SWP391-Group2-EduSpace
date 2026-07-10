package org.eduspace.backend.repository;

import org.eduspace.backend.entity.RescueRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RescueRequestRepository extends JpaRepository<RescueRequest, Long> {
}
