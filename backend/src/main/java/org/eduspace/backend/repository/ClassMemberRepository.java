package org.eduspace.backend.repository;

import java.util.List;

import org.eduspace.backend.entity.ClassMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassMemberRepository extends JpaRepository<ClassMember, Long> {
    List<ClassMember> findByCourseClassId(Long classId);
}