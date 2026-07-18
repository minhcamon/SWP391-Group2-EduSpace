package org.eduspace.backend.repository;

import org.eduspace.backend.entity.WithdrawRequest;
import org.eduspace.backend.enums.WithdrawStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WithdrawRequestRepository extends JpaRepository<WithdrawRequest, Long> {
    List<WithdrawRequest> findByClassMemberCourseClassCourseCreatorId(Long creatorId);
    List<WithdrawRequest> findByClassMemberUserId(Long mentorId);
    boolean existsByClassMemberIdAndStatusIn(Long classMemberId, List<WithdrawStatus> statuses);
}
