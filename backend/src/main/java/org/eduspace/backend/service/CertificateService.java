package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.progress.response.CertificateResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Certificate;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CertificateService {

    private final ClassMemberRepository classMemberRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final CertificateRepository certificateRepository;
    private final ActiveMentorRepository activeMentorRepository;
    private final NotificationService notificationService;

    @Transactional
    public void checkAndIssueCertificate(ClassMember classMember) {
        Course course = classMember.getCourseClass().getCourse();
        List<CourseModule> modules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());

        long totalLessons = 0;
        long completedLessons = 0;

        for (CourseModule module : modules) {
            List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(module.getId());
            Set<Long> completedSet = new HashSet<>(lessonProgressRepository
                    .findCompletedLessonIdsByClassMemberIdAndModuleId(classMember.getId(), module.getId()));
            totalLessons += lessons.size();
            for (Lesson lesson : lessons) {
                if (completedSet.contains(lesson.getId())) {
                    completedLessons++;
                }
            }
        }

        long totalAssignments = assignmentRepository.countByCourseId(course.getId());
        long completedAssignments = submissionRepository.countCompletedAssignments(
                classMember.getId(), course.getId(), SubmissionStatus.GRADED);

        long totalUnits = totalLessons + totalAssignments;
        long completedUnits = completedLessons + completedAssignments;

        boolean isCompleted = totalUnits > 0 && completedUnits >= totalUnits;

        if (isCompleted) {
            boolean exists = certificateRepository
                    .findByUserIdAndCourseId(classMember.getUser().getId(), course.getId()).isPresent();
            if (!exists) {
                Certificate certificate = Certificate.builder()
                        .user(classMember.getUser())
                        .course(course)
                        .issuedAt(LocalDateTime.now())
                        .build();
                certificateRepository.save(certificate);

                notificationService.sendToUser(classMember.getUser(),
                        "Chúc mừng bạn đã hoàn thành 100% khóa học " + course.getTitle() + " và nhận được chứng chỉ!",
                        NotificationType.SYSTEM,
                        course.getId());
            }
        }
    }

    @Transactional
    public CertificateResponse getCertificateDetails(Long classId, Long userId) {
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("Thành viên không thuộc lớp học này"));

        Course course = classMember.getCourseClass().getCourse();

        Certificate certificate = certificateRepository.findByUserIdAndCourseId(userId, course.getId()).orElse(null);
        boolean isCompleted = false;
        if (certificate != null) {
            isCompleted = !isCompleted;
        }
        boolean isAlreadyMentor = activeMentorRepository.existsByUserIdAndCourseId(userId, course.getId());
        User creator = course.getCreator();
        return CertificateResponse.builder()
                .isCompleted(isCompleted)
                .isAlreadyMentor(isAlreadyMentor)
                .userName(classMember.getUser().getFullName())
                .courseTitle(course.getTitle())
                .certificateId(certificate != null ? "EDU-CS-" + certificate.getId() : "")
                .issuedAt(certificate != null ? certificate.getIssuedAt() : null)
                .author(creator.getFullName())
                .build();
    }
}
