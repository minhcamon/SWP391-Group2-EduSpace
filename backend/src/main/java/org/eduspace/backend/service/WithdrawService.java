package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.mentor.request.SubmitWithdrawRequestDto;
import org.eduspace.backend.dto.mentor.response.MentorResponse;
import org.eduspace.backend.dto.mentor.response.WithdrawDetailResponse;
import org.eduspace.backend.entity.ActiveMentor;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.WithdrawRequest;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.WithdrawScenario;
import org.eduspace.backend.enums.WithdrawStatus;
import org.eduspace.backend.exception.BadRequestException;
import org.eduspace.backend.exception.ForbiddenException;
import org.eduspace.backend.exception.NotFoundException;
import org.eduspace.backend.repository.ActiveMentorRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.ClassRepository;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.repository.WithdrawRequestRepository;
import org.eduspace.backend.entity.CourseClass;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WithdrawService {

    private final ClassMemberRepository classMemberRepository;
    private final ClassRepository classRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final UserRepository userRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final NotificationService notificationService;

    @Transactional
    public WithdrawRequest submitWithdrawRequest(Long mentorId, Long classId, SubmitWithdrawRequestDto dto) {
        // Lock membership row to prevent race conditions during mentor count validation
        ClassMember membership = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRoleForWrite(classId, mentorId, "MENTOR")
                .orElseThrow(() -> new BadRequestException("Bạn không phải là mentor của lớp học này"));

        if (membership.getLearnerStatus() != LearnerStatus.ACTIVE) {
            throw new BadRequestException("Trạng thái hiện tại không hợp lệ để xin rút lui");
        }

        if (withdrawRequestRepository.existsByClassMemberIdAndStatusIn(
                membership.getId(), List.of(WithdrawStatus.PENDING, WithdrawStatus.HANDOVER_PENDING))) {
            throw new BadRequestException("Bạn đã có đơn rút lui đang xử lý cho lớp này");
        }

        // Count remaining active mentors in this class (including current mentor before marking pending)
        long activeMentorCount = classMemberRepository.countActiveMentorsInClass(classId);
        WithdrawScenario scenario = activeMentorCount >= 2
                ? WithdrawScenario.SCENARIO_A_SOFT
                : WithdrawScenario.SCENARIO_B_URGENT;

        membership.setLearnerStatus(LearnerStatus.PENDING_WITHDRAWAL);
        classMemberRepository.save(membership);

        WithdrawRequest request = withdrawRequestRepository.save(WithdrawRequest.builder()
                .classMember(membership)
                .reason(dto.getReason())
                .expectedLeaveDate(dto.getExpectedLeaveDate())
                .scenario(scenario)
                .status(WithdrawStatus.PENDING)
                .build());

        if (scenario == WithdrawScenario.SCENARIO_B_URGENT) {
            notificationService.sendUrgentCreatorAlert(request);
        } else {
            notificationService.notifyRemainingMentors(
                    membership.getCourseClass(),
                    mentorId,
                    membership.getUser().getFullName()
            );
        }

        return request;
    }

    @Transactional
    public void rejectWithdrawRequest(Long requestId, Long creatorId) {
        WithdrawRequest request = getAndValidateOwnership(requestId, creatorId);
        validateResolvable(request, List.of(WithdrawStatus.PENDING, WithdrawStatus.HANDOVER_PENDING));

        // If replacement mentor was pending handover -> deactivate the replacement's membership
        if (request.getStatus() == WithdrawStatus.HANDOVER_PENDING && request.getReplacementMember() != null) {
            request.getReplacementMember().setLearnerStatus(LearnerStatus.INACTIVE);
            classMemberRepository.save(request.getReplacementMember());
        }

        request.getClassMember().setLearnerStatus(LearnerStatus.ACTIVE);
        request.setStatus(WithdrawStatus.REJECTED);
        request.setResolvedAt(LocalDateTime.now());
        classMemberRepository.save(request.getClassMember());
        withdrawRequestRepository.save(request);

        String msg = String.format("Yêu cầu rút lui khỏi lớp %s của bạn đã bị từ chối.",
                request.getClassMember().getCourseClass().getName());
        notificationService.sendToUser(request.getClassMember().getUser(), msg, org.eduspace.backend.enums.NotificationType.SYSTEM, request.getClassMember().getCourseClass().getId());
    }

    @Transactional
    public void cancelWithdrawRequest(Long mentorUserId, Long classId) {
        ClassMember membership = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, mentorUserId, "MENTOR")
                .orElseThrow(() -> new BadRequestException("Bạn không thuộc lớp này"));

        if (membership.getLearnerStatus() != LearnerStatus.PENDING_WITHDRAWAL) {
            throw new BadRequestException("Lớp học không ở trạng thái chờ rút lui");
        }

        WithdrawRequest request = withdrawRequestRepository
                .findByClassMemberIdAndStatusIn(
                        membership.getId(),
                        List.of(WithdrawStatus.PENDING, WithdrawStatus.HANDOVER_PENDING)
                )
                .stream()
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Không tìm thấy đơn xin rút lui đang chờ xử lý"));

        if (request.getStatus() == WithdrawStatus.HANDOVER_PENDING && request.getReplacementMember() != null) {
            request.getReplacementMember().setLearnerStatus(LearnerStatus.INACTIVE);
            classMemberRepository.save(request.getReplacementMember());
        }

        membership.setLearnerStatus(LearnerStatus.ACTIVE);
        request.setStatus(WithdrawStatus.REJECTED);
        request.setResolvedAt(LocalDateTime.now());
        
        classMemberRepository.save(membership);
        withdrawRequestRepository.save(request);
    }

    @Transactional
    public void initiateHandover(Long requestId, Long newMentorUserId, Long creatorId) {
        WithdrawRequest request = getAndValidateOwnership(requestId, creatorId);
        validateResolvable(request, List.of(WithdrawStatus.PENDING));

        Long classId = request.getClassMember().getCourseClass().getId();
        boolean alreadyInClass = classMemberRepository
                .findByCourseClassIdAndUserIdAndContextRole(classId, newMentorUserId, "MENTOR")
                .filter(cm -> cm.getLearnerStatus() == LearnerStatus.ACTIVE)
                .isPresent();
        if (alreadyInClass) {
            throw new BadRequestException("Mentor này đã hỗ trợ lớp này rồi");
        }

        if (request.getClassMember().getUser().getId().equals(newMentorUserId)) {
            throw new BadRequestException("Không thể bàn giao cho chính mentor đang xin rút");
        }

        // Validate active class capacity limit
        if (classMemberRepository.countActiveClassesForMentor(newMentorUserId) >= 2) {
            throw new BadRequestException("Mentor đã đạt giới hạn 2 lớp hoạt động đồng thời");
        }

        ClassMember newMembership = classMemberRepository.save(ClassMember.builder()
                .courseClass(request.getClassMember().getCourseClass())
                .user(userRepository.getReferenceById(newMentorUserId))
                .contextRole("MENTOR")
                .learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now())
                .build());

        request.setReplacementMember(newMembership);
        request.setStatus(WithdrawStatus.HANDOVER_PENDING);
        withdrawRequestRepository.save(request);
    }

    @Transactional
    public void approveHandover(Long requestId, Long creatorId) {
        WithdrawRequest request = getAndValidateOwnership(requestId, creatorId);
        if (request.getStatus() == WithdrawStatus.PENDING) {
            if (request.getScenario() != WithdrawScenario.SCENARIO_A_SOFT) {
                throw new BadRequestException("Chỉ cho phép duyệt trực tiếp đối với yêu cầu rút lui mềm (Scenario A)");
            }
        } else {
            validateResolvable(request, List.of(WithdrawStatus.HANDOVER_PENDING));
        }

        request.getClassMember().setLearnerStatus(LearnerStatus.INACTIVE);
        request.setStatus(WithdrawStatus.COMPLETED);
        request.setResolvedAt(LocalDateTime.now());
        classMemberRepository.save(request.getClassMember());
        withdrawRequestRepository.save(request);

        String msg = String.format("Yêu cầu rút lui khỏi lớp %s của bạn đã được phê duyệt thành công.",
                request.getClassMember().getCourseClass().getName());
        notificationService.sendToUser(request.getClassMember().getUser(), msg, org.eduspace.backend.enums.NotificationType.SYSTEM, request.getClassMember().getCourseClass().getId());

        if (request.getReplacementMember() != null) {
            String replacementMsg = String.format("Bạn đã được phân công tiếp quản làm Mentor cho lớp %s thay thế cho Mentor %s.",
                    request.getClassMember().getCourseClass().getName(),
                    request.getClassMember().getUser().getFullName());
            notificationService.sendToUser(request.getReplacementMember().getUser(), replacementMsg, org.eduspace.backend.enums.NotificationType.SYSTEM, request.getClassMember().getCourseClass().getId());
        }
    }

    @Transactional
    public void creatorTakeOver(Long requestId, Long creatorId) {
        WithdrawRequest request = getAndValidateOwnership(requestId, creatorId);
        if (request.getScenario() != WithdrawScenario.SCENARIO_B_URGENT) {
            throw new BadRequestException("Chỉ áp dụng cho lớp không còn mentor nào khác");
        }
        validateResolvable(request, List.of(WithdrawStatus.PENDING));

        // Create new membership for Creator
        ClassMember newMembership = classMemberRepository.save(ClassMember.builder()
                .courseClass(request.getClassMember().getCourseClass())
                .user(userRepository.getReferenceById(creatorId))
                .contextRole("MENTOR")
                .learnerStatus(LearnerStatus.ACTIVE)
                .joinedAt(LocalDateTime.now())
                .build());

        request.setReplacementMember(newMembership);
        request.getClassMember().setLearnerStatus(LearnerStatus.INACTIVE);
        request.setStatus(WithdrawStatus.COMPLETED);
        request.setResolvedAt(LocalDateTime.now());
        classMemberRepository.save(request.getClassMember());
        withdrawRequestRepository.save(request);

        String msg = String.format("Yêu cầu rút lui khỏi lớp %s của bạn đã được phê duyệt thành công.",
                request.getClassMember().getCourseClass().getName());
        notificationService.sendToUser(request.getClassMember().getUser(), msg, org.eduspace.backend.enums.NotificationType.SYSTEM, request.getClassMember().getCourseClass().getId());
    }

    @Transactional(readOnly = true)
    public WithdrawDetailResponse getWithdrawRequest(Long requestId, Long userId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy yêu cầu rút lui"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

        boolean isAuthorized = request.getClassMember().getUser().getId().equals(userId)
                || request.getClassMember().getCourseClass().getCourse().getCreator().getId().equals(userId)
                || user.getRole().name().equals("ADMIN");

        if (!isAuthorized) {
            throw new ForbiddenException("Bạn không có quyền xem yêu cầu rút lui này");
        }

        return convertToDto(request);
    }

    @Transactional(readOnly = true)
    public List<WithdrawDetailResponse> getWithdrawRequestsForCreator(Long creatorId) {
        return withdrawRequestRepository.findByClassMemberCourseClassCourseCreatorId(creatorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<WithdrawDetailResponse> getMyWithdrawRequests(Long mentorId) {
        return withdrawRequestRepository.findByClassMemberUserId(mentorId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private WithdrawRequest getAndValidateOwnership(Long requestId, Long creatorId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy yêu cầu rút lui"));
        Long actualCreatorId = request.getClassMember().getCourseClass().getCourse().getCreator().getId();
        if (!actualCreatorId.equals(creatorId)) {
            throw new ForbiddenException("Bạn không có quyền xử lý đơn này");
        }
        return request;
    }

    private void validateResolvable(WithdrawRequest request, List<WithdrawStatus> allowedStatuses) {
        if (!allowedStatuses.contains(request.getStatus())) {
            throw new BadRequestException("Yêu cầu không ở trạng thái hợp lệ để thực hiện thao tác này");
        }
    }

    public WithdrawDetailResponse convertToDto(WithdrawRequest request) {
        MentorResponse mentorRes = MentorResponse.builder()
                .id(request.getClassMember().getUser().getId())
                .fullName(request.getClassMember().getUser().getFullName())
                .email(request.getClassMember().getUser().getEmail())
                .avatarUrl(request.getClassMember().getUser().getAvatarUrl())
                .build();

        MentorResponse newMentorRes = null;
        if (request.getReplacementMember() != null) {
            newMentorRes = MentorResponse.builder()
                    .id(request.getReplacementMember().getUser().getId())
                    .fullName(request.getReplacementMember().getUser().getFullName())
                    .email(request.getReplacementMember().getUser().getEmail())
                    .avatarUrl(request.getReplacementMember().getUser().getAvatarUrl())
                    .build();
        }

        return WithdrawDetailResponse.builder()
                .id(request.getId())
                .classId(request.getClassMember().getCourseClass().getId())
                .className(request.getClassMember().getCourseClass().getName())
                .mentor(mentorRes)
                .reason(request.getReason())
                .expectedLeaveDate(request.getExpectedLeaveDate())
                .status(request.getStatus())
                .scenario(request.getScenario())
                .newMentor(newMentorRes)
                .createdAt(request.getCreatedAt())
                .resolvedAt(request.getResolvedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<MentorResponse> getActiveMentorsForCourse(Long courseId, Long classId) {
        List<ActiveMentor> activePool = activeMentorRepository.findByCourseId(courseId);

        return activePool.stream()
                .filter(am -> am.getMentorStatus() == org.eduspace.backend.enums.MentorStatus.AVAILABLE)
                .filter(am -> {
                    // Check if mentor has < 2 active classes
                    long activeClassesCount = classMemberRepository.countActiveClassesForMentor(am.getUser().getId());
                    if (activeClassesCount >= 2) {
                        return false;
                    }
                    // If classId is provided, check if mentor is already active in that class
                    if (classId != null) {
                        boolean alreadyInClass = classMemberRepository
                                .findByCourseClassIdAndUserIdAndContextRole(classId, am.getUser().getId(), "MENTOR")
                                .filter(cm -> cm.getLearnerStatus() == LearnerStatus.ACTIVE)
                                .isPresent();
                        return !alreadyInClass;
                    }
                    return true;
                })
                .map(am -> MentorResponse.builder()
                        .id(am.getUser().getId())
                        .fullName(am.getUser().getFullName())
                        .email(am.getUser().getEmail())
                        .avatarUrl(am.getUser().getAvatarUrl())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MentorResponse> getActiveMentorsForClass(Long classId) {
        CourseClass cc = classRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp học"));
        Long courseId = cc.getCourse().getId();
        return getActiveMentorsForCourse(courseId, classId);
    }
}
