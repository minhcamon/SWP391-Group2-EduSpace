package org.eduspace.backend.repository;

import java.util.List;

import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
     // Hàm xóa các thành viên có trạng thái DROPPED hoặc FAILED ra khỏi nhóm
    @Modifying
    @Query("DELETE FROM GroupMember gm WHERE gm.classMemberId IN " +
            "(SELECT cm.id FROM ClassMember cm WHERE cm.classId = :classId AND cm.learnerStatus IN ('DROPPED', 'FAILED'))")
    void deleteByLearnerStatusNotActive(@Param("classId") Long classId);

    // Trả về List<ClassMember> để đảm bảo ánh xạ chuẩn xác với cấu trúc thực thể trong Service
    @Query("SELECT cm FROM ClassMember cm " +
           "JOIN GroupMember gm ON cm.id = gm.classMember.id " +
           "WHERE cm.courseClass.id = :classId AND cm.learnerStatus = 'ACTIVE' " +
           "AND gm.studyGroup.id IN " +
           "(SELECT gm2.studyGroup.id FROM GroupMember gm2 GROUP BY gm2.studyGroup.id HAVING COUNT(gm2.id) = 1)")
    List<ClassMember> findOrphansByClassId(@Param("classId") Long classId);
}