package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.mentor.response.MentorResponse;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.WithdrawStatus;
import org.eduspace.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreatorClassService {

    private final ClassRepository classRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final UserRepository userRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;

    private CourseClass checkCreatorOwnershipAndGetClass(Long classId, Long creatorId) {
        CourseClass cc = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));
        if (!cc.getCourse().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Bạn không có quyền quản lý lớp học này");
        }
        return cc;
    }

    public List<MentorResponse> getClassMentors(Long classId, Long creatorId) {
        checkCreatorOwnershipAndGetClass(classId, creatorId);

        List<ClassMember> classMembers = classMemberRepository.findByCourseClassIdAndContextRole(classId, "MENTOR");
        return classMembers.stream()
                .map(cm -> MentorResponse.builder()
                        .id(cm.getUser().getId())
                        .fullName(cm.getUser().getFullName())
                        .email(cm.getUser().getEmail())
                        .avatarUrl(cm.getUser().getAvatarUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void addMentorToClass(Long classId, Long mentorId, Long creatorId) {
        CourseClass cc = checkCreatorOwnershipAndGetClass(classId, creatorId);

        User mentor = userRepository.findById(mentorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng làm Mentor"));

        // Check if mentor is active for this course
        boolean isCourseMentor = activeMentorRepository.existsByUserIdAndCourseId(mentorId, cc.getCourse().getId());
        if (!isCourseMentor) {
            throw new RuntimeException("Người dùng này không phải là Mentor hoạt động của khóa học này!");
        }

        // Check if already assigned to class
        boolean alreadyAssigned = classMemberRepository
                .findByUserIdAndCourseClassIdAndContextRole(mentorId, classId, "MENTOR")
                .isPresent();
        if (alreadyAssigned) {
            throw new RuntimeException("Mentor này đã được gán vào lớp học rồi!");
        }

        ClassMember newMember = ClassMember.builder()
                .courseClass(cc)
                .user(mentor)
                .contextRole("MENTOR")
                .joinedAt(LocalDateTime.now())
                .build();

        classMemberRepository.save(newMember);
    }

    @Transactional
    public void removeMentorFromClass(Long classId, Long mentorId, Long creatorId) {
        checkCreatorOwnershipAndGetClass(classId, creatorId);

        ClassMember member = classMemberRepository
                .findByUserIdAndCourseClassIdAndContextRole(mentorId, classId, "MENTOR")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mentor này trong lớp học"));

        classMemberRepository.delete(member);
    }

    @Transactional
    public void initiateHandover(Long requestId, Long newMentorId, Long creatorId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu rút lui"));

        // Check ownership
        if (!request.getCourseClass().getCourse().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Bạn không có quyền quản lý đơn này");
        }

        if (request.getStatus() != WithdrawStatus.PENDING) {
            throw new RuntimeException("Yêu cầu rút lui này đã được xử lý hoặc đang trong quy trình bàn giao");
        }

        // Check if new mentor is active for course
        boolean isCourseMentor = activeMentorRepository
                .existsByUserIdAndCourseId(newMentorId, request.getCourseClass().getCourse().getId());
        if (!isCourseMentor) {
            throw new RuntimeException("Người dùng này không phải là Mentor hoạt động của khóa học này!");
        }

        if (request.getMentor().getId().equals(newMentorId)) {
            throw new RuntimeException("Không thể bàn giao lớp học cho chính mentor đang yêu cầu xin nghỉ!");
        }

        User newMentor = userRepository.findById(newMentorId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Mentor mới"));

        request.setNewMentor(newMentor);
        request.setStatus(WithdrawStatus.HANDOVER_PENDING);
        withdrawRequestRepository.save(request);
    }

    @Transactional
    public void approveHandover(Long requestId, Long creatorId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu rút lui"));

        // Check ownership
        if (!request.getCourseClass().getCourse().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Bạn không có quyền quản lý đơn này");
        }

        if (request.getStatus() != WithdrawStatus.HANDOVER_PENDING || request.getNewMentor() == null) {
            throw new RuntimeException("Yêu cầu bàn giao chưa được thiết lập hoặc đã hoàn tất!");
        }

        CourseClass cc = request.getCourseClass();
        User oldMentor = request.getMentor();
        User newMentor = request.getNewMentor();

        // 1. Delete old mentor's membership
        classMemberRepository.findByUserIdAndCourseClassIdAndContextRole(oldMentor.getId(), cc.getId(), "MENTOR")
                .ifPresent(classMemberRepository::delete);

        // 2. Add new mentor's membership (if not already there)
        boolean isNewMentorAssigned = classMemberRepository
                .findByUserIdAndCourseClassIdAndContextRole(newMentor.getId(), cc.getId(), "MENTOR")
                .isPresent();

        if (!isNewMentorAssigned) {
            ClassMember newMember = ClassMember.builder()
                    .courseClass(cc)
                    .user(newMentor)
                    .contextRole("MENTOR")
                    .joinedAt(LocalDateTime.now())
                    .build();
            classMemberRepository.save(newMember);
        }

        // 3. Mark request as completed
        request.setStatus(WithdrawStatus.COMPLETED);
        withdrawRequestRepository.save(request);
    }
}
