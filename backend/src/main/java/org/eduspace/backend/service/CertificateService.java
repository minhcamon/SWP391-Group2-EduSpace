package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.progress.response.CertificateResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.Certificate;
import org.eduspace.backend.enums.SubmissionStatus;
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
    private final StudyGroupService groupService;

    @Transactional
    public CertificateResponse getCertificateDetails(Long classId, Long userId) {
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("Thành viên không thuộc lớp học này"));

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

        Certificate certificate = null;
        if (isCompleted) {
            certificate = certificateRepository.findByUserIdAndCourseId(userId, course.getId()).orElse(null);
            if (certificate == null) {
                certificate = Certificate.builder()
                        .user(classMember.getUser())
                        .course(course)
                        .issuedAt(LocalDateTime.now())
                        .build();
                certificate = certificateRepository.save(certificate);
            }
        }

        // Find partner name (if any) across modules
        String partnerName = "Chưa có";
        for (CourseModule module : modules) {
            ClassMember partnerClassMember = groupService.findPartnerForModule(classMember, module.getId());
            if (partnerClassMember != null) {
                partnerName = partnerClassMember.getUser().getFullName();
                break;
            }
        }

        return CertificateResponse.builder()
                .isCompleted(isCompleted)
                .userName(classMember.getUser().getFullName())
                .courseTitle(course.getTitle())
                .certificateId(certificate != null ? "EDU-CS-" + certificate.getId() : "")
                .issuedAt(certificate != null ? certificate.getIssuedAt() : null)
                .partnerName(partnerName)
                .build();
    }
}
