package org.eduspace.backend.repository;

import java.util.Optional;
import org.eduspace.backend.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {
       // 1. Hàm xóa các nhóm trống không còn ai (Lọc theo Class và Module hiện tại)
       @Modifying
       @Query("DELETE FROM StudyGroup sg " +
                     "WHERE sg.courseClass.id = :classId " +
                     "AND sg.module.id = :moduleId " +
                     "AND sg.id NOT IN (SELECT DISTINCT gm.studyGroup.id FROM GroupMember gm)")
       void deleteEmptyGroups(@Param("classId") Long classId, @Param("moduleId") Long moduleId);

       // 2. Hàm giải tán các nhóm bị khuyết chỉ còn 1 người (Lọc theo Class và Module
       // hiện tại)
       @Modifying
       @Query("DELETE FROM StudyGroup sg " +
                     "WHERE sg.courseClass.id = :classId " +
                     "AND sg.module.id = :moduleId " +
                     "AND sg.id IN (SELECT gm.studyGroup.id FROM GroupMember gm GROUP BY gm.studyGroup.id HAVING COUNT(gm.id) = 1)")
       void deleteGroupsWithSingleMember(@Param("classId") Long classId, @Param("moduleId") Long moduleId);

       // 3. Thuật toán tìm các nhóm có đúng 2 người xếp từ EXP thấp nhất lên cao
       @Query("SELECT sg FROM StudyGroup sg " +
                     "JOIN GroupMember gm ON gm.studyGroup = sg " +
                     "WHERE sg.courseClass.id = :classId " +
                     "AND sg.module.id = :moduleId " +
                     "GROUP BY sg.id " +
                     "HAVING COUNT(gm.id) = 2 " +
                     "ORDER BY SUM(gm.classMember.user.totalExp) ASC")
       List<StudyGroup> findAvailableGroupsWithLowestExpInternal(@Param("classId") Long classId,
                     @Param("moduleId") Long moduleId, Pageable pageable);

       // 4. Hàm Default đại diện để Service gọi trực tiếp lấy ra ĐÚNG 1 nhóm thấp nhất
       // mà không bị crash
       default Optional<StudyGroup> findAvailableGroupWithLowestExp(Long classId, Long moduleId) {
              List<StudyGroup> results = findAvailableGroupsWithLowestExpInternal(classId, moduleId,
                            org.springframework.data.domain.PageRequest.of(0, 1));
              return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
       }

       // Tìm nhóm vừa tạo gần nhất (Phục vụ luồng chuyển module)
       Optional<StudyGroup> findTopByCourseClassIdAndModuleIdOrderByIdDesc(Long classId, Long moduleId);
}
