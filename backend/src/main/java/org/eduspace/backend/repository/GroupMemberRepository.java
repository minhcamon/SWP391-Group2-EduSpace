package org.eduspace.backend.repository;

import java.util.List;

import org.eduspace.backend.dto.group.GroupMemberDTO;
import org.eduspace.backend.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
    List<GroupMember> findByMemberId(Long memberId);

    // Truy vấn thông tin User từ ID của Nhóm học (study_group_id)
    @Query("SELECT new org.eduspace.backend.dto.group.GroupMemberDTO(u.id, u.fullName, u.email, u.username, u.avatarUrl, u.totalExp) " +
           "FROM GroupMember gm " +
           "JOIN gm.member cm " + 
           "JOIN cm.user u " +   
           "WHERE gm.group.id = :studyGroupId")
    List<GroupMemberDTO> findMembersByStudyGroupId(@Param("studyGroupId") Long studyGroupId);
}
