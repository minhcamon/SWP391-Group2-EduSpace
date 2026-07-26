package org.eduspace.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.eduspace.backend.dto.course.response.CourseProgressResponse;
import org.eduspace.backend.dto.progress.response.CourseProgressDashboardResponse;
import org.eduspace.backend.dto.progress.response.ModuleProgressResponse;
import org.eduspace.backend.dto.progress.response.LessonProgressResponse;
import org.eduspace.backend.dto.user.response.PartnerResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseClass;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.Assignment;
import org.eduspace.backend.entity.Submission;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.StudyGroup;
import org.eduspace.backend.entity.WaitlistEntry;
import org.eduspace.backend.dto.progress.response.AssignmentProgressResponse;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.WaitlistEntryRepository;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.helper.ProgressHelper;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.ClassTimelineRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.LessonProgressRepository;
import org.eduspace.backend.repository.LessonRepository;
import org.eduspace.backend.dto.study_group.response.MentorPairProgressResponse;
import org.eduspace.backend.repository.ModuleRepository;
import org.eduspace.backend.repository.StudyGroupRepository;
import org.eduspace.backend.repository.SubmissionRepository;
import org.eduspace.backend.repository.CertificateRepository;
import org.eduspace.backend.repository.PeerReviewRepository;
import org.eduspace.backend.entity.Certificate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProgressService {
    private final ClassMemberRepository classMemberRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final ClassTimelineRepository classTimelineRepository;
    private final ProgressHelper progressHelper;
    private final GroupMemberRepository groupMemberRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final CertificateRepository certificateRepository;
    private final PeerReviewRepository peerReviewRepository;

    @Lazy
    @Autowired
    private CertificateService certificateService;

    /**
     * Lấy danh sách các khóa học mà Learner ĐANG HỌC (in-progress), kèm phần trăm
     * tiến trình hoàn thành trên toàn bộ khóa học. Tiến trình tính trên cả lesson
     * và
     * assignment (assignment coi là hoàn thành khi có submission GRADED).
     * Lấy toàn bộ các khóa học (cả đang chờ, đang học và đã hoàn thành).
     */
    public List<CourseProgressResponse> getInProgressCourses(Long userId) {
        List<ClassMember> memberships = classMemberRepository.findByUserIdAndContextRole(userId, "LEARNER");

        List<CourseProgressResponse> result = new ArrayList<>();
        Set<Long> processedCourseIds = new HashSet<>();

        for (ClassMember classMember : memberships) {
            // Đã nghỉ học (DROPPED) hoặc rớt (FAILED) -> không còn "đang học"
            LearnerStatus learnerStatus = classMember.getLearnerStatus();
            if (learnerStatus == LearnerStatus.DROPPED || learnerStatus == LearnerStatus.FAILED) {
                continue;
            }

            CourseClass courseClass = classMember.getCourseClass();
            if (courseClass == null) {
                continue;
            }

            Course course = courseClass.getCourse();
            if (course == null || course.isDeleted()) {
                continue;
            }

            processedCourseIds.add(course.getId());

            // Duyệt module theo thứ tự để vừa tính tiến trình, vừa tìm bài học hiện tại
            // (bài đầu tiên chưa hoàn thành theo thứ tự module -> lesson).
            List<CourseModule> modules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());

            long totalLessons = 0;
            long completedLessons = 0;
            Lesson currentLesson = null;
            CourseModule currentModule = null;

            for (CourseModule module : modules) {
                List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(module.getId());
                Set<Long> completedSet = new HashSet<>(lessonProgressRepository
                        .findCompletedLessonIdsByClassMemberIdAndModuleId(classMember.getId(), module.getId()));

                totalLessons += lessons.size();

                for (Lesson lesson : lessons) {
                    if (completedSet.contains(lesson.getId())) {
                        completedLessons++;
                    } else if (currentLesson == null) {
                        currentLesson = lesson;
                        currentModule = module;
                    }
                }
            }

            // Assignment cũng được tính vào tiến trình như lesson.
            long totalAssignments = assignmentRepository.countByCourseId(course.getId());
            long completedAssignments = submissionRepository.countCompletedAssignments(
                    classMember.getId(), course.getId(), SubmissionStatus.GRADED);

            long totalUnits = totalLessons + totalAssignments;
            long completedUnits = completedLessons + completedAssignments;

            long pendingReviews = peerReviewRepository.countPendingReviews(classMember.getId());
            Boolean isCompleted = (totalUnits > 0 && completedUnits >= totalUnits && pendingReviews == 0);

            double progressPercentage = totalUnits > 0
                    ? ((double) completedUnits / totalUnits) * 100
                    : 0.0;
            progressPercentage = Math.round(progressPercentage * 10) / 10.0;

            result.add(CourseProgressResponse.builder()
                    .courseId(course.getId())
                    .courseName(course.getTitle())
                    .courseDescription(course.getDescription())
                    .progressPercentage(progressPercentage)
                    .classId(courseClass.getId())
                    .currentLessonId(currentLesson != null ? currentLesson.getId() : null)
                    .currentLessonTitle(currentLesson != null ? currentLesson.getTitle() : null)
                    .currentModuleTitle(currentModule != null ? currentModule.getTitle() : null)
                    .isCompleted(isCompleted)
                    .build());
        }

        List<WaitlistEntry> waitlistEntries = waitlistEntryRepository.findByUserIdAndStatus(userId,
                WaitlistStatus.OPENING);
        for (WaitlistEntry entry : waitlistEntries) {
            Course course = entry.getWaitlist().getCourse();
            if (course == null || course.isDeleted()) {
                continue;
            }
            processedCourseIds.add(course.getId());
            result.add(CourseProgressResponse.builder()
                    .courseId(course.getId())
                    .courseName(course.getTitle())
                    .courseDescription(course.getDescription())
                    .progressPercentage(0.0)
                    .classId(null)
                    .currentLessonId(null)
                    .currentLessonTitle(null)
                    .currentModuleTitle(null)
                    .isCompleted(false)
                    .build());
        }

        // Bổ sung các khóa học đã có chứng chỉ (hoàn thành) vào danh sách, tránh bỏ sót
        // Mentor
        List<Certificate> certificates = certificateRepository.findByUserId(userId);
        for (Certificate certificate : certificates) {
            Course course = certificate.getCourse();
            if (course == null || course.isDeleted() || processedCourseIds.contains(course.getId())) {
                continue;
            }

            // Tìm bất kỳ lớp học nào mà user có tham gia trong khóa này (cả vai trò LEARNER
            // hoặc MENTOR) để gán classId hợp lệ
            Long classId = classMemberRepository.findByUserId(userId).stream()
                    .filter(cm -> cm.getCourseClass() != null && cm.getCourseClass().getCourse() != null
                            && cm.getCourseClass().getCourse().getId().equals(course.getId()))
                    .map(cm -> cm.getCourseClass().getId())
                    .findFirst()
                    .orElse(null);

            result.add(CourseProgressResponse.builder()
                    .courseId(course.getId())
                    .courseName(course.getTitle())
                    .courseDescription(course.getDescription())
                    .progressPercentage(100.0)
                    .classId(classId)
                    .currentLessonId(null)
                    .currentLessonTitle(null)
                    .currentModuleTitle(null)
                    .isCompleted(true)
                    .build());
        }

        return result;
    }

    public double getLearnerProgressPercentage(Long classMemberId, Long courseId) {
        List<CourseModule> modules = moduleRepository.findByCourseIdOrderBySortOrder(courseId);

        long totalLessons = 0;
        long completedLessons = 0;

        for (CourseModule module : modules) {
            List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(module.getId());
            Set<Long> completedSet = new HashSet<>(lessonProgressRepository
                    .findCompletedLessonIdsByClassMemberIdAndModuleId(classMemberId, module.getId()));

            totalLessons += lessons.size();

            for (Lesson lesson : lessons) {
                if (completedSet.contains(lesson.getId())) {
                    completedLessons++;
                }
            }
        }

        long totalAssignments = assignmentRepository.countByCourseId(courseId);
        long completedAssignments = submissionRepository.countCompletedAssignments(
                classMemberId, courseId, SubmissionStatus.GRADED);

        long totalUnits = totalLessons + totalAssignments;
        long completedUnits = completedLessons + completedAssignments;

        double progressPercentage = totalUnits > 0
                ? ((double) completedUnits / totalUnits) * 100
                : 0.0;
        return Math.round(progressPercentage * 10) / 10.0;
    }

    public CourseProgressDashboardResponse getProgressDashboard(Long classId, Long userId, Long moduleId) {
        ClassMember classMember = classMemberRepository.findFirstByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("This member does not belong to this class"));

        Course course = classMember.getCourseClass().getCourse();

        List<CourseModule> courseModules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());
        int firstUncompletedIndex = -1;
        boolean previousModuleIsOverdue = false;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime timeline = null;

        List<ModuleProgressResponse> modulesProgress = new ArrayList<>();

        for (int i = 0; i < courseModules.size(); i++) {
            CourseModule module = courseModules.get(i);
            timeline = classTimelineRepository.findByCourseClassIdAndModuleId(classId, module.getId());
            long totalLessons = lessonRepository.countByModuleId(module.getId());
            long completedLessons = lessonProgressRepository
                    .countCompletedLessonsByClassMemberIdAndModuleId(classMember.getId(), module.getId());

            Assignment assignment = assignmentRepository.findByModuleId(module.getId()).orElse(null);
            long totalAssignments = assignment != null ? 1 : 0;
            long completedAssignments = 0;

            AssignmentProgressResponse assignmentResponse = null;

            if (assignment != null) {
                Submission submission = submissionRepository
                        .findByMemberIdAndAssignmentId(classMember.getId(), assignment.getId()).orElse(null);
                String assignStatus = "NOT_STARTED";
                boolean assignCompleted = false;
                if (submission != null) {
                    assignStatus = submission.getStatus().name();
                    if (submission.getStatus() == SubmissionStatus.GRADED) {
                        assignCompleted = true;
                        completedAssignments = 1;
                    } else if (submission.getStatus() == SubmissionStatus.SUBMITTED) {
                        assignCompleted = true;
                    }
                }
                assignmentResponse = AssignmentProgressResponse.builder()
                        .id(assignment.getId())
                        .title(assignment.getTitle())
                        .status(assignStatus)
                        .isCompleted(assignCompleted)
                        .submissionId(submission != null ? submission.getId() : null)
                        .build();
            }

            long totalUnits = totalLessons + totalAssignments;
            long completedUnits = completedLessons + completedAssignments;

            double progressPercent = totalUnits > 0 ? ((double) completedUnits / totalUnits) * 100 : 0.0;
            progressPercent = Math.round(progressPercent * 10) / 10.0;

            String status = "NOT_STARTED";
            boolean isLocked = true;
            boolean isCompletedModule = (totalUnits > 0 && completedUnits == totalUnits);

            // Kiểm tra xem Creator/Mentor đã thực sự ấn Bắt đầu / mở nhóm học cho Module
            // này chưa
            boolean isModuleStartedByCreator = !studyGroupRepository
                    .findByCourseClassIdAndModuleId(classId, module.getId()).isEmpty();

            // Module mở khóa nếu Creator đã Start HOẶC module trước đó đã quá hạn (Overdue)
            if (isModuleStartedByCreator || previousModuleIsOverdue) {
                isLocked = false;
                status = progressHelper.determineModuleStatus(isCompletedModule);

                if (!isCompletedModule && firstUncompletedIndex == -1) {
                    firstUncompletedIndex = i;
                }
            } else {
                status = "NOT_STARTED";
                isLocked = true;
            }

            boolean isOverdue = timeline != null && now.isAfter(timeline);
            previousModuleIsOverdue = isOverdue;

            boolean isAssignmentLocked = isLocked || (totalLessons > 0 && completedLessons < totalLessons);
            if (assignmentResponse != null) {
                assignmentResponse.setLocked(isAssignmentLocked);
            }

            // Load list of lessons and completed status
            List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(module.getId());
            List<Long> completedLessonIds = lessonProgressRepository
                    .findCompletedLessonIdsByClassMemberIdAndModuleId(classMember.getId(), module.getId());
            Set<Long> completedSet = new HashSet<>(completedLessonIds);
            // Find partner and build partner response
            List<GroupMember> userGroupMembers = groupMemberRepository.findByClassMemberId(classMember.getId());
            StudyGroup studyGroup = userGroupMembers.stream()
                    .map(GroupMember::getStudyGroup)
                    .filter(g -> g.getModule() != null && g.getModule().getId().equals(module.getId()))
                    .findFirst()
                    .orElse(null);

            List<ClassMember> partnerClassMembers = new java.util.ArrayList<>();
            if (studyGroup != null) {
                List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroup.getId());
                partnerClassMembers = groupMembers.stream()
                        .map(GroupMember::getClassMember)
                        .filter(m -> !m.getId().equals(classMember.getId()))
                        .toList();
            }
            List<PartnerResponse> partnerResponses = progressHelper.buildPartnerResponses(partnerClassMembers, lessons,
                    module.getId());

            List<LessonProgressResponse> lessonResponses = progressHelper.buildLessonProgressResponses(
                    lessons, completedSet, partnerResponses);

            if (isLocked) {
                lessonResponses.forEach(l -> l.setLocked(true));
            }

            Long studyGroupId = null;
            if (studyGroup != null) {
                studyGroupId = studyGroup.getId();
            }

            modulesProgress.add(ModuleProgressResponse.builder()
                    .id(module.getId())
                    .title(module.getTitle())
                    .progress(progressPercent)
                    .status(status)
                    .isLocked(isLocked)
                    .sortOrder(module.getSortOrder())
                    .completedLessons((int) completedLessons)
                    .totalLessons((int) totalLessons)
                    .lessons(lessonResponses)
                    .assignment(assignmentResponse)
                    .partners(partnerResponses)
                    .studyGroupId(studyGroupId)
                    .build());
        }

        // Xác định focusModuleId: module chưa hoàn thành đầu tiên, hoặc module cuối nếu
        // đã xong hết
        int focusIndex = firstUncompletedIndex;
        if (focusIndex == -1 && !modulesProgress.isEmpty()) {
            focusIndex = modulesProgress.size() - 1;
        }

        Long focusModuleId;
        Long focusLessonId = null;

        if (moduleId == null) {
            if (focusIndex >= 0 && focusIndex < modulesProgress.size()) {
                ModuleProgressResponse targetModule = modulesProgress.get(focusIndex);
                focusModuleId = targetModule.getId();
                if (!targetModule.getLessons().isEmpty()) {
                    focusLessonId = targetModule.getLessons().stream()
                            .filter(l -> !l.isCompleted())
                            .map(LessonProgressResponse::getId)
                            .findFirst()
                            .orElse(targetModule.getLessons().get(0).getId());
                }
            } else {
                focusModuleId = null;
            }
        } else {
            ModuleProgressResponse targetModule = modulesProgress.stream()
                    .filter(m -> m.getId().equals(moduleId) && !m.isLocked())
                    .findFirst()
                    .orElse(null);

            if (targetModule != null) {
                focusModuleId = targetModule.getId();
                if (!targetModule.getLessons().isEmpty()) {
                    focusLessonId = targetModule.getLessons().stream()
                            .filter(l -> !l.isCompleted())
                            .map(LessonProgressResponse::getId)
                            .findFirst()
                            .orElse(targetModule.getLessons().get(0).getId());
                }
            } else {
                if (focusIndex >= 0 && focusIndex < modulesProgress.size()) {
                    focusModuleId = modulesProgress.get(focusIndex).getId();
                } else {
                    focusModuleId = null;
                }
            }

        }

        return CourseProgressDashboardResponse.builder()
                .focusModuleId(focusModuleId)
                .focusLessonId(focusLessonId)
                .modules(modulesProgress)
                .classId(classId)
                .build();
    }

    @Transactional
    public boolean completeLesson(Long lessonId, Long userId, Long classId) {
        ClassMember classMember = classMemberRepository.findFirstByUserIdAndCourseClassId(userId, classId).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("User is not a member of this class"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!lesson.getModule().getCourse().getId().equals(classMember.getCourseClass().getCourse().getId())) {
            throw new RuntimeException("Lesson does not belong to the same course as the class member");
        }

        // Mark the lesson as completed for the user
        boolean result = progressHelper.markLessonAsCompleted(lesson, classMember);

        if (result) {
            certificateService.checkAndIssueCertificate(classMember);
        }

        return result;
    }

    public MentorPairProgressResponse getPairProgressForMentor(Long pairId, Long mentorUserId) {
        StudyGroup studyGroup = studyGroupRepository.findById(pairId)
                .orElseThrow(() -> new RuntimeException("Pair not found"));

        ClassMember mentorMembership = classMemberRepository
                .findFirstByUserIdAndCourseClassId(mentorUserId, studyGroup.getCourseClass().getId())
                .orElseThrow(() -> new RuntimeException("You are not a mentor in this class"));

        if (!"MENTOR".equals(mentorMembership.getContextRole())) {
            throw new RuntimeException("You are not a mentor in this class");
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByStudyGroupId(studyGroup.getId());

        Course course = studyGroup.getCourseClass().getCourse();
        String courseName = course != null ? course.getTitle() : null;
        String className = studyGroup.getCourseClass() != null ? studyGroup.getCourseClass().getName() : null;

        List<MentorPairProgressResponse.PairMemberProgress> membersProgress = new ArrayList<>();
        for (GroupMember gm : groupMembers) {
            ClassMember cm = gm.getClassMember();
            if (cm != null) {
                double overall = 0.0;
                if (course != null) {
                    overall = getLearnerProgressPercentage(cm.getId(), course.getId());
                }
                membersProgress.add(MentorPairProgressResponse.PairMemberProgress.builder()
                        .userId(cm.getUser() != null ? cm.getUser().getId() : null)
                        .name(cm.getUser() != null ? cm.getUser().getFullName() : null)
                        .avatarUrl(cm.getUser() != null ? cm.getUser().getAvatarUrl() : null)
                        .overallProgress(overall)
                        .build());
            }
        }

        List<MentorPairProgressResponse.ModuleProgressDetail> moduleProgressDetails = new ArrayList<>();

        if (course != null) {
            List<CourseModule> courseModules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());
            for (CourseModule module : courseModules) {
                long totalLessons = lessonRepository.countByModuleId(module.getId());
                List<MentorPairProgressResponse.MemberModuleProgress> memberModuleProgresses = new ArrayList<>();

                for (GroupMember gm : groupMembers) {
                    ClassMember cm = gm.getClassMember();
                    if (cm != null) {
                        long completedLessons = lessonProgressRepository
                                .countCompletedLessonsByClassMemberIdAndModuleId(cm.getId(), module.getId());

                        boolean assignmentCompleted = false;
                        Assignment assignment = assignmentRepository.findByModuleId(module.getId()).orElse(null);
                        if (assignment != null) {
                            Submission submission = submissionRepository
                                    .findByMemberIdAndAssignmentId(cm.getId(), assignment.getId()).orElse(null);
                            if (submission != null && submission.getStatus() == SubmissionStatus.GRADED) {
                                assignmentCompleted = true;
                            }
                        }

                        long totalUnits = totalLessons + (assignment != null ? 1 : 0);
                        long completedUnits = completedLessons + (assignmentCompleted ? 1 : 0);
                        double progressPercent = totalUnits > 0 ? ((double) completedUnits / totalUnits) * 100 : 0.0;
                        progressPercent = Math.round(progressPercent * 10) / 10.0;

                        memberModuleProgresses.add(MentorPairProgressResponse.MemberModuleProgress.builder()
                                .userId(cm.getUser() != null ? cm.getUser().getId() : null)
                                .progress(progressPercent)
                                .completedLessons((int) completedLessons)
                                .totalLessons((int) totalLessons)
                                .assignmentCompleted(assignmentCompleted)
                                .build());
                    }
                }

                moduleProgressDetails.add(MentorPairProgressResponse.ModuleProgressDetail.builder()
                        .moduleId(module.getId())
                        .moduleTitle(module.getTitle())
                        .sortOrder(module.getSortOrder())
                        .memberProgresses(memberModuleProgresses)
                        .build());
            }
        }

        return MentorPairProgressResponse.builder()
                .pairId(studyGroup.getId())
                .pairName("Pair " + studyGroup.getId())
                .courseName(courseName)
                .className(className)
                .members(membersProgress)
                .modules(moduleProgressDetails)
                .build();
    }
}
