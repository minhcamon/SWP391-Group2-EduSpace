package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.incident.response.MentorDashboardResponse;
import org.eduspace.backend.dto.mentor.request.WithdrawRequestDto;
import org.eduspace.backend.dto.mentor.response.MentorClassResponse;
import org.eduspace.backend.dto.mentor.response.MentorClassDetailResponse;
import org.eduspace.backend.dto.mentor.response.WithdrawDetailResponse;
import org.eduspace.backend.dto.mentor.response.MentorResponse;
import org.eduspace.backend.dto.mentor.response.MentorArbitrationResponse;
import org.eduspace.backend.dto.study_group.response.StudyGroupResponse;
import org.eduspace.backend.enums.IncidentStatus;
import org.eduspace.backend.enums.WithdrawStatus;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.repository.*;
import org.eduspace.backend.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorService {

    private final IncidentRepository incidentRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CertificateRepository certificateRepository;
    private final ClassRepository classRepository;
    private final WithdrawRequestRepository withdrawRequestRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupService studyGroupService;

    @Transactional
    public void assignMentorToCourse(Long userId, Long courseId) {
        // Enforce the business rule: only users who completed the course can be mentors
        boolean hasCompleted = certificateRepository.existsByUserIdAndCourseId(userId, courseId);
        if (!hasCompleted) {
            throw new RuntimeException("Người dùng chưa hoàn thành khóa học này, không thể làm Mentor!");
        }

        // Fetch User and Course
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // Save ActiveMentor
        ActiveMentor activeMentor = ActiveMentor.builder()
                .user(user)
                .course(course)
                .mentorStatus(org.eduspace.backend.enums.MentorStatus.AVAILABLE)
                .build();
        activeMentorRepository.save(activeMentor);
    }

    public MentorDashboardResponse getDashboardData(Long userId) {

        long inProgressIncidents = incidentRepository.countByResolvedByUserIdAndStatus(userId,
                IncidentStatus.IN_PROGRESS);

        List<IncidentStatus> resolvedStatuses = Arrays.asList(IncidentStatus.RESOLVED, IncidentStatus.REJECTED,
                IncidentStatus.CLOSED);
        long resolvedIncidents = incidentRepository.countByResolvedByUserIdAndStatusIn(userId,
                resolvedStatuses);

        long assignedClasses = classMemberRepository.countByUserIdAndContextRole(userId, "MENTOR");

        long assignedCourses = activeMentorRepository.countByUserId(userId);

        return MentorDashboardResponse.builder()
                .inProgressIncidents(inProgressIncidents)
                .resolvedIncidents(resolvedIncidents)
                .assignedClasses(assignedClasses)
                .assignedCourses(assignedCourses)
                .build();
    }

    public List<MentorClassResponse> getMentorClasses(Long userId) {
        List<ClassMember> classMembers = classMemberRepository.findByUserIdAndContextRole(userId, "MENTOR");
        return classMembers.stream()
                .map(cm -> {
                    CourseClass cc = cm.getCourseClass();
                    List<StudyGroup> groups = studyGroupRepository.findByCourseClassId(cc.getId());
                    long numberOfPairs = groups.size();
                    return MentorClassResponse.builder()
                            .id(cc.getId())
                            .name(cc.getName())
                            .activatedAt(cc.getActivatedAt())
                            .status(cc.getStatus())
                            .courseId(cc.getCourse().getId())
                            .courseTitle(cc.getCourse().getTitle())
                            .numberOfPairs(numberOfPairs)
                            .studyGroups(
                                groups.stream()
                                    .map(group -> StudyGroupResponse.builder()
                                        .studyGroupId(group.getId())
                                        .status(group.getChatStatus())
                                        .build())
                                    .collect(Collectors.toList()))
                            .build();
                })
                .collect(Collectors.toList());
    }

    public MentorClassDetailResponse getMentorClassDetail(Long classId, Long userId) {
        // Check if user is mentor in this class
        classMemberRepository.findByUserIdAndCourseClassIdAndContextRole(userId, classId, "MENTOR")
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp học này"));

        CourseClass cc = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        List<ClassMember> mentors = classMemberRepository.findByCourseClassIdAndContextRole(classId, "MENTOR");
        List<MentorResponse> mentorResponses = mentors.stream()
                .map(m -> MentorResponse.builder()
                        .id(m.getUser().getId())
                        .fullName(m.getUser().getFullName())
                        .email(m.getUser().getEmail())
                        .avatarUrl(m.getUser().getAvatarUrl())
                        .build())
                .collect(Collectors.toList());

        long numberOfPairs = studyGroupRepository.findByCourseClassId(classId).size();

        return MentorClassDetailResponse.builder()
                .id(cc.getId())
                .name(cc.getName())
                .activatedAt(cc.getActivatedAt())
                .status(cc.getStatus())
                .courseId(cc.getCourse().getId())
                .courseTitle(cc.getCourse().getTitle())
                .courseDescription(cc.getCourse().getDescription())
                .mentors(mentorResponses)
                .numberOfPairs(numberOfPairs)
                .build();
    }

    public List<StudyGroupResponse> getMentorClassPairs(Long classId, Long userId) {
        classMemberRepository.findByUserIdAndCourseClassIdAndContextRole(userId, classId, "MENTOR")
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp học này"));

        return studyGroupService.getAllStudyGroup(classId);
    }

    @Transactional
    public void createWithdrawRequest(Long userId, WithdrawRequestDto dto) {
        // Check if user is mentor in this class
        classMemberRepository.findByUserIdAndCourseClassIdAndContextRole(userId, dto.getClassId(), "MENTOR")
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp học này"));

        CourseClass cc = classRepository.findById(dto.getClassId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        User mentor = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Check if there is already a PENDING or HANDOVER_PENDING request for this class
        List<WithdrawRequest> existing = withdrawRequestRepository.findByMentorId(userId).stream()
                .filter(r -> r.getCourseClass().getId().equals(dto.getClassId()) &&
                        (r.getStatus() == WithdrawStatus.PENDING ||
                                r.getStatus() == WithdrawStatus.HANDOVER_PENDING))
                .toList();
        if (!existing.isEmpty()) {
            throw new RuntimeException("Bạn đã gửi yêu cầu rút lui cho lớp học này và đang chờ xử lý!");
        }

        WithdrawRequest request = WithdrawRequest.builder()
                .courseClass(cc)
                .mentor(mentor)
                .reason(dto.getReason())
                .expectedLeaveDate(dto.getExpectedLeaveDate())
                .status(WithdrawStatus.PENDING)
                .build();

        withdrawRequestRepository.save(request);
    }

    public WithdrawDetailResponse getWithdrawRequest(Long requestId, Long userId) {
        WithdrawRequest request = withdrawRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu rút lui"));

        // Auth check: user must be the mentor who requested, OR the creator of the course of the class, OR admin.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        boolean isAuthorized = request.getMentor().getId().equals(userId)
                || request.getCourseClass().getCourse().getCreator().getId().equals(userId)
                || user.getRole() == Role.ADMIN;

        if (!isAuthorized) {
            throw new RuntimeException("Bạn không có quyền xem yêu cầu rút lui này");
        }

        MentorResponse mentorRes = MentorResponse.builder()
                .id(request.getMentor().getId())
                .fullName(request.getMentor().getFullName())
                .email(request.getMentor().getEmail())
                .avatarUrl(request.getMentor().getAvatarUrl())
                .build();

        MentorResponse newMentorRes = null;
        if (request.getNewMentor() != null) {
            newMentorRes = MentorResponse.builder()
                    .id(request.getNewMentor().getId())
                    .fullName(request.getNewMentor().getFullName())
                    .email(request.getNewMentor().getEmail())
                    .avatarUrl(request.getNewMentor().getAvatarUrl())
                    .build();
        }

        return WithdrawDetailResponse.builder()
                .id(request.getId())
                .classId(request.getCourseClass().getId())
                .className(request.getCourseClass().getName())
                .mentor(mentorRes)
                .reason(request.getReason())
                .expectedLeaveDate(request.getExpectedLeaveDate())
                .status(request.getStatus())
                .newMentor(newMentorRes)
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }

    public List<MentorArbitrationResponse> getArbitrationsForMentor(Long userId) {
        List<ClassMember> managedClasses = classMemberRepository.findByUserIdAndContextRole(userId, "MENTOR");
        if (managedClasses.isEmpty()) {
            throw new RuntimeException("Bạn không quản lý lớp học nào");
        }

        List<Long> classIds = managedClasses.stream()
                .map(cm -> cm.getCourseClass().getId())
                .collect(Collectors.toList());

        List<Incident> incidents = incidentRepository.findByReporterCourseClassIds(classIds);

        return incidents.stream()
                .map(this::toArbitrationResponse)
                .collect(Collectors.toList());
    }

    public MentorArbitrationResponse getArbitrationDetailForMentor(Long incidentId, Long userId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu phân xử"));

        Long classId = incident.getReporter() != null && incident.getReporter().getCourseClass() != null
                ? incident.getReporter().getCourseClass().getId() : null;

        if (classId == null) {
            throw new RuntimeException("Yêu cầu phân xử không hợp lệ (thiếu lớp học)");
        }

        // Verify if user is mentor in this class
        classMemberRepository.findByUserIdAndCourseClassIdAndContextRole(userId, classId, "MENTOR")
                .orElseThrow(() -> new RuntimeException("Bạn không phải là mentor của lớp học này và không có quyền truy cập"));

        return toArbitrationResponse(incident);
    }

    private MentorArbitrationResponse toArbitrationResponse(Incident i) {
        String reporterName = i.getReporter() != null && i.getReporter().getUser() != null
                ? i.getReporter().getUser().getFullName() : null;
        Long reporterUserId = i.getReporter() != null && i.getReporter().getUser() != null
                ? i.getReporter().getUser().getId() : null;

        String reportedName = i.getReported() != null && i.getReported().getUser() != null
                ? i.getReported().getUser().getFullName() : null;
        Long reportedUserId = i.getReported() != null && i.getReported().getUser() != null
                ? i.getReported().getUser().getId() : null;

        Long classId = i.getReporter() != null && i.getReporter().getCourseClass() != null
                ? i.getReporter().getCourseClass().getId() : null;
        String className = i.getReporter() != null && i.getReporter().getCourseClass() != null
                ? i.getReporter().getCourseClass().getName() : null;
        String courseTitle = i.getReporter() != null && i.getReporter().getCourseClass() != null
                && i.getReporter().getCourseClass().getCourse() != null
                ? i.getReporter().getCourseClass().getCourse().getTitle() : null;

        Long submissionId = i.getSubmission() != null ? i.getSubmission().getId() : null;
        String submissionTitle = i.getSubmission() != null && i.getSubmission().getAssignment() != null
                ? i.getSubmission().getAssignment().getTitle() : null;

        String resolvedByName = i.getResolvedBy() != null && i.getResolvedBy().getUser() != null
                ? i.getResolvedBy().getUser().getFullName() : null;

        return MentorArbitrationResponse.builder()
                .id(i.getId())
                .incidentType(i.getIncidentType())
                .reporterUserId(reporterUserId)
                .reporterName(reporterName)
                .reportedUserId(reportedUserId)
                .reportedName(reportedName)
                .reason(i.getReason())
                .evidenceUrl(i.getEvidenceUrl())
                .status(i.getStatus())
                .classId(classId)
                .className(className)
                .courseTitle(courseTitle)
                .submissionId(submissionId)
                .submissionTitle(submissionTitle)
                .resolvedByName(resolvedByName)
                .resolutionNote(i.getResolutionNote())
                .createdAt(i.getCreatedAt())
                .solvedAt(i.getSolvedAt())
                .build();
    }
}
