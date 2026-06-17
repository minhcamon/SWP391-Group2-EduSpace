package org.eduspace.backend.repository;

import java.util.List;
import java.util.Optional;

import org.eduspace.backend.entity.ClassMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassMemberRepository extends JpaRepository<ClassMember, Long> {
    Optional<ClassMember> findByUserIdAndCourseClassId(Long userId, Long classId);

    List<ClassMember> findByUserId(Long userId);
}
