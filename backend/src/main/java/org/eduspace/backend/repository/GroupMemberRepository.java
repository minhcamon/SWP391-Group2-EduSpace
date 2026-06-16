package org.eduspace.backend.repository;

import java.util.List;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    // 1. Chỉ xóa thành viên nghỉ học thuộc các nhóm của Lớp và Module hiện tại để tránh mất lịch sử module cũ
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

    // 2. Tìm kiếm học viên mồ côi (Nhóm chỉ còn đúng 1 người) chuẩn JPQL
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
}