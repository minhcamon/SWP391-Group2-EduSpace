package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.mentor_application.response.MentorApplicationDetailResponse;
import org.eduspace.backend.dto.mentor_application.response.MentorApplicationResponse;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.MentorStatus;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.RequestStatus;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorApplicationService {

    private final MentorApplicationRepository mentorApplicationRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final ClassMemberRepository classMemberRepository;
    private final CertificateRepository certificateRepository;
    private final SubmissionRepository submissionRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final NotificationService notificationService;

    @Transactional
    public void applyToBecomeMentor(Long userId, Long classId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + userId));

        CourseClass courseClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học với ID: " + classId));

        Course course = courseClass.getCourse();
        if (course == null) {
            throw new RuntimeException("Lớp học này không liên kết với khóa học nào!");
        }

        // 1. Kiểm tra đã có chứng chỉ chưa
        boolean hasCertificate = certificateRepository.existsByUserIdAndCourseId(userId, course.getId());
        if (!hasCertificate) {
            throw new RuntimeException("Bạn chưa hoàn thành khóa học để có chứng chỉ!");
        }

        // 2. Kiểm tra đơn ứng tuyển trùng lặp
        boolean alreadyPending = mentorApplicationRepository.existsByUserIdAndCourseIdAndStatus(userId, course.getId(), RequestStatus.PENDING);
        if (alreadyPending) {
            throw new RuntimeException("Bạn đã có đơn ứng tuyển đang chờ duyệt cho khóa học này!");
        }

        boolean alreadyApproved = mentorApplicationRepository.existsByUserIdAndCourseIdAndStatus(userId, course.getId(), RequestStatus.APPROVED);
        if (alreadyApproved) {
            throw new RuntimeException("Bạn đã là Mentor của khóa học này!");
        }

        // 3. Tạo đơn mới
        MentorApplication application = MentorApplication.builder()
                .user(user)
                .course(course)
                .courseClass(courseClass)
                .status(RequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        mentorApplicationRepository.save(application);

        // 4. Gửi thông báo cho Creator của khóa học
        User creator = course.getCreator();
        if (creator != null) {
            notificationService.sendToUser(
                    creator,
                    "Học viên " + user.getFullName() + " đã nộp đơn xin làm Mentor cho khóa học " + course.getTitle() + ".",
                    NotificationType.MENTOR_APPLICATION,
                    application.getId()
            );
        }
    }

    @Transactional(readOnly = true)
    public List<MentorApplicationResponse> getMentorApplicationsForCreator(Long creatorId) {
        List<MentorApplication> applications = mentorApplicationRepository.findByCourseCreatorIdOrderByIdDesc(creatorId);

        return applications.stream()
                .map(app -> MentorApplicationResponse.builder()
                        .id(app.getId())
                        .userId(app.getUser().getId())
                        .userName(app.getUser().getFullName())
                        .userEmail(app.getUser().getEmail())
                        .courseId(app.getCourse().getId())
                        .courseTitle(app.getCourse().getTitle())
                        .status(app.getStatus().name())
                        .createdAt(app.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MentorApplicationDetailResponse getApplicationDetails(Long applicationId, Long creatorId) {
        MentorApplication app = mentorApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));

        // Xác thực người xem là Creator của khóa học đó
        if (!app.getCourse().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Bạn không có quyền xem chi tiết đơn ứng tuyển này!");
        }

        // Lấy ClassMember tương ứng của học viên trong lớp
        ClassMember member = classMemberRepository.findByUserIdAndCourseClassId(app.getUser().getId(), app.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin tham gia lớp học của ứng viên!"));

        // Lấy danh sách bài nộp của học viên trong lớp đó
        List<Submission> submissions = submissionRepository.findByMemberId(member.getId());

        List<MentorApplicationDetailResponse.SubmissionDetail> submissionDetails = new ArrayList<>();
        for (Submission sub : submissions) {
            PeerReview review = sub.getPeerReview();
            MentorApplicationDetailResponse.SubmissionDetail detail = MentorApplicationDetailResponse.SubmissionDetail.builder()
                    .assignmentTitle(sub.getAssignment().getTitle())
                    .assignmentDescription(sub.getAssignment().getDescription())
                    .submissionContent(sub.getSubmissionContent())
                    .submittedAt(sub.getSubmittedAt())
                    .status(sub.getStatus().name())
                    .finalScore(review != null ? review.getFinalScore() : null)
                    .comments(review != null ? review.getComments() : null)
                    .criteriaScores(review != null ? review.getCriteriaScores() : null)
                    .build();
            submissionDetails.add(detail);
        }

        return MentorApplicationDetailResponse.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userName(app.getUser().getFullName())
                .userEmail(app.getUser().getEmail())
                .courseId(app.getCourse().getId())
                .courseTitle(app.getCourse().getTitle())
                .status(app.getStatus().name())
                .createdAt(app.getCreatedAt())
                .rejectedReason(app.getRejectedReason())
                .submissions(submissionDetails)
                .build();
    }

    @Transactional
    public void approveMentorApplication(Long applicationId, Long creatorId) {
        MentorApplication app = mentorApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));

        if (!app.getCourse().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Bạn không có quyền duyệt đơn ứng tuyển này!");
        }

        if (app.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Đơn ứng tuyển này đã được xử lý từ trước!");
        }

        // Cập nhật trạng thái đơn
        app.setStatus(RequestStatus.APPROVED);
        app.setProcessedAt(LocalDateTime.now());
        mentorApplicationRepository.save(app);

        // Nâng cấp vai trò người dùng thành MENTOR
        User applicant = app.getUser();
        if (applicant.getRole() == Role.LEARNER) {
            applicant.setRole(Role.MENTOR);
            userRepository.save(applicant);
        }

        // Tạo bản ghi ActiveMentor
        ActiveMentor activeMentor = ActiveMentor.builder()
                .user(applicant)
                .course(app.getCourse())
                .mentorStatus(MentorStatus.AVAILABLE)
                .build();
        activeMentorRepository.save(activeMentor);

        // Gửi thông báo cho học viên
        notificationService.sendToUser(
                applicant,
                "Đơn ứng tuyển làm Mentor khóa học " + app.getCourse().getTitle() + " của bạn đã được phê duyệt!",
                NotificationType.MENTOR_APPLICATION,
                app.getId()
        );
    }

    @Transactional
    public void rejectMentorApplication(Long applicationId, Long creatorId, String reason) {
        MentorApplication app = mentorApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));

        if (!app.getCourse().getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Bạn không có quyền từ chối đơn ứng tuyển này!");
        }

        if (app.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Đơn ứng tuyển này đã được xử lý từ trước!");
        }

        // Cập nhật trạng thái đơn
        app.setStatus(RequestStatus.REJECTED);
        app.setRejectedReason(reason);
        app.setProcessedAt(LocalDateTime.now());
        mentorApplicationRepository.save(app);

        // Gửi thông báo cho học viên
        User applicant = app.getUser();
        notificationService.sendToUser(
                applicant,
                "Đơn ứng tuyển làm Mentor khóa học " + app.getCourse().getTitle() + " của bạn đã bị từ chối. Lý do: " + reason,
                NotificationType.MENTOR_APPLICATION,
                app.getId()
        );
    }
}
