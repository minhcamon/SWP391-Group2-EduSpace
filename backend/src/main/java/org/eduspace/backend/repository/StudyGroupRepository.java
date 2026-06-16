package org.eduspace.backend.repository;

import org.eduspace.backend.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    // Hàm xóa các nhóm trống không còn ai (Trường hợp out cả 2 người)
    @Modifying
    @Query("DELETE FROM StudyGroup sg WHERE sg.classId = :classId " +
           "AND sg.id NOT IN (SELECT DISTINCT gm.studyGroupId FROM GroupMember gm)")
    void deleteEmptyGroups(@Param("classId") Long classId);

    // Hàm giải tán các nhóm bị khuyết (chỉ còn 1 người) để tí nữa gom người đó đi xếp lại nhóm mới
    @Modifying
    @Query("DELETE FROM StudyGroup sg WHERE sg.classId = :classId " +
           "AND sg.id IN (SELECT gm.studyGroupId FROM GroupMember gm GROUP BY gm.studyGroupId HAVING COUNT(gm.id) = 1)")
    void deleteGroupsWithSingleMember(@Param("classId") Long classId);

    // Thuật toán tìm nhóm có đúng 2 người và tổng EXP thấp nhất (Dùng cho case n == 1)
    @Query("SELECT sg FROM StudyGroup sg " +
           "JOIN GroupMember gm ON gm.studyGroupId = sg.id " +
           "JOIN ClassMember cm ON gm.classMemberId = cm.id " +
           "JOIN User u ON cm.userId = u.id " +
           "WHERE sg.classId = :classId " +
           "GROUP BY sg.id " +
           "HAVING COUNT(gm.id) = 2 " + 
           "ORDER BY SUM(u.totalExp) ASC LIMIT 1")
    Optional<StudyGroup> findAvailableGroupWithLowestExp(@Param("classId") Long classId);
}