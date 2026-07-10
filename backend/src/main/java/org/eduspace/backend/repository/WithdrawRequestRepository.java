package org.eduspace.backend.repository;

import org.eduspace.backend.entity.WithdrawRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Long> {
    List<WithdrawRequest> findByMentorId(Long mentorId);
    List<WithdrawRequest> findByCourseClassId(Long classId);
    List<WithdrawRequest> findByCourseClassCourseCreatorId(Long creatorId);
}
