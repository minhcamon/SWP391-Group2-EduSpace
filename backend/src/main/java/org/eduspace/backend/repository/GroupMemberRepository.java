package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.eduspace.backend.dto.study_group.response.GroupMemberDTO;
import org.eduspace.backend.entity.ClassMember;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
        List<GroupMember> findByStudyGroupId(Long groupId);

        List<GroupMember> findByClassMemberId(Long memberId);

        @Modifying
        @Query("DELETE FROM GroupMember gm " +
                        "WHERE gm.studyGroup.courseClass.id = :classId " +
                        "AND gm.studyGroup.module.id = :moduleId " +
                        "AND gm.classMember.id IN (" +
                        "  SELECT cm.id FROM ClassMember cm " +
                        "  WHERE cm.courseClass.id = :classId " +
                        "  AND cm.learnerStatus IN ('DROPPED', 'FAILED')" +
                        ")")
        void deleteByLearnerStatusNotActive(@Param("classId") Long classId, @Param("moduleId") Long moduleId);

        @Query("SELECT gm.classMember FROM GroupMember gm " +
                        "WHERE gm.studyGroup.courseClass.id = :classId " +
                        "AND gm.studyGroup.module.id = :moduleId " +
                        "AND gm.classMember.learnerStatus = 'ACTIVE' " +
                        "AND gm.studyGroup.id IN (" +
                        "  SELECT gm2.studyGroup.id FROM GroupMember gm2 " +
                        "  GROUP BY gm2.studyGroup.id " +
                        "  HAVING COUNT(gm2.id) = 1" +
                        ")")
        List<ClassMember> findOrphansByClassId(@Param("classId") Long classId, @Param("moduleId") Long moduleId);

        @Modifying
        @Query("DELETE FROM GroupMember gm WHERE gm.classMember IN :orphans AND gm.studyGroup.courseClass.id = :classId AND gm.studyGroup.module.id = :moduleId")
        void deleteAllByClassMemberInAndStudyGroupCourseClassIdAndStudyGroupModuleId(
                        @Param("orphans") List<ClassMember> orphans,
                        @Param("classId") Long classId,
                        @Param("moduleId") Long moduleId);

        Optional<GroupMember> findByStudyGroupIdAndClassMemberId(Long studyGroupId, Long classMemberId);

        Optional<GroupMember> findByStudyGroupIdAndClassMemberUserId(Long studyGroupId, Long userId);

        @Query("SELECT gm.studyGroup.id FROM GroupMember gm " +
                        "WHERE gm.classMember.id = :classMemberId " +
                        "AND gm.studyGroup.module.id = :moduleId " +
                        "ORDER BY gm.studyGroup.id DESC")
        List<Long> findStudyGroupIdByMemberAndModule(
                        @Param("classMemberId") Long classMemberId,
                        @Param("moduleId") Long moduleId);

        
        @Query("SELECT new org.eduspace.backend.dto.study_group.response.GroupMemberDTO(" +
                        "u.id, u.fullName, u.email, u.username, u.avatarUrl, u.totalExp) " +
                        "FROM GroupMember gm " +
                        "JOIN gm.classMember cm " +
                        "JOIN cm.user u " +
                        "WHERE gm.studyGroup.id = :studyGroupId")
        List<GroupMemberDTO> findMembersByStudyGroupId(@Param("studyGroupId") Long studyGroupId);
}
