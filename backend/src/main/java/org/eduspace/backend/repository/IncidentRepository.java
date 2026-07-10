package org.eduspace.backend.repository;

import org.eduspace.backend.entity.Incident;
import org.eduspace.backend.enums.IncidentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.resolvedBy.user.id = :userId AND i.status = :status")
    long countByResolvedByUserIdAndStatus(@Param("userId") Long userId, @Param("status") IncidentStatus status);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.resolvedBy.user.id = :userId AND i.status IN :statuses")
    long countByResolvedByUserIdAndStatusIn(@Param("userId") Long userId, @Param("statuses") List<IncidentStatus> statuses);

    @Query("SELECT i FROM Incident i WHERE i.resolvedBy.user.id = :userId AND i.status = :status")
    List<Incident> findByResolvedByUserIdAndStatus(@Param("userId") Long userId, @Param("status") IncidentStatus status);

    @Query("SELECT i FROM Incident i WHERE i.id = :incidentId AND i.resolvedBy.user.id = :userId")
    Incident findByIdAndResolvedByUserId(@Param("incidentId") Long incidentId, @Param("userId") Long userId);
}
