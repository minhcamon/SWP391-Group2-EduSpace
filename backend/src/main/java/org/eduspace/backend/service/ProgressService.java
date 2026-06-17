package org.eduspace.backend.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.eduspace.backend.dto.course.response.CourseProgressResponse;
import org.eduspace.backend.dto.progress.response.CourseProgressDashboardResponse;
import org.eduspace.backend.dto.progress.response.LessonProgressResponse;
import org.eduspace.backend.dto.progress.response.ModuleDetailResponse;
import org.eduspace.backend.dto.progress.response.ModuleProgressResponse;
import org.eduspace.backend.dto.user.response.PartnerResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseClass;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.helper.ProgressHelper;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.ClassTimelineRepository;
import org.eduspace.backend.repository.LessonProgressRepository;
import org.eduspace.backend.repository.LessonRepository;
import org.eduspace.backend.repository.ModuleRepository;
import org.eduspace.backend.repository.SubmissionRepository;
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
    private final GroupService groupService;
    private final ProgressHelper progressHelper;

    /**
     * Lấy danh sách các khóa học mà Learner ĐANG HỌC (in-progress), kèm phần trăm
     * tiến trình hoàn thành trên toàn bộ khóa học. Tiến trình tính trên cả lesson
     * và
     * assignment (assignment coi là hoàn thành khi có submission GRADED). Các khóa
     * đã
     * hoàn thành 100% được loại ra (sẽ hiển thị ở trang "đã hoàn thành" riêng).
     */
    public List<CourseProgressResponse> getInProgressCourses(Long userId) {
        List<ClassMember> memberships = classMemberRepository.findByUserId(userId);

        List<CourseProgressResponse> result = new ArrayList<>();

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

            // Đã hoàn thành toàn bộ khóa học -> không thuộc danh sách "đang học"
            if (totalUnits > 0 && completedUnits >= totalUnits) {
                continue;
            }

            double progressPercentage = totalUnits > 0
                    ? ((double) completedUnits / totalUnits) * 100
                    : 0.0;
            progressPercentage = Math.round(progressPercentage * 10) / 10.0;

            result.add(CourseProgressResponse.builder()
                    .courseId(course.getId())
                    .courseName(course.getTitle())
                    .progressPercentage(progressPercentage)
                    .classId(courseClass.getId())
                    .currentLessonId(currentLesson != null ? currentLesson.getId() : null)
                    .currentLessonTitle(currentLesson != null ? currentLesson.getTitle() : null)
                    .currentModuleTitle(currentModule != null ? currentModule.getTitle() : null)
                    .build());
        }

        return result;
    }

    /**
     * Sidebar API: Trả về danh sách modules kèm tiến trình + focusModuleId.
     * KHÔNG load chi tiết lessons hay partner — việc đó do getModuleDetail đảm
     * nhận.
     */
    public CourseProgressDashboardResponse getProgressDashboard(Long classId, Long userId) {
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("This member does not belong to this class"));

        Course course = classMember.getCourseClass().getCourse();

        List<CourseModule> courseModules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime timeline = null;

        List<ModuleProgressResponse> modulesProgress = new ArrayList<>();

        int firstUncompletedIndex = -1;
        boolean previousModuleAllowsNext = true;

        for (int i = 0; i < courseModules.size(); i++) {
            CourseModule module = courseModules.get(i);
            timeline = classTimelineRepository.findByCourseClassIdAndModuleId(classId, module.getId());
            long totalLessons = lessonRepository.countByModuleId(module.getId());
            long completedLessons = lessonProgressRepository
                    .countCompletedLessonsByClassMemberIdAndModuleId(classMember.getId(), module.getId());

            double progressPercent = totalLessons > 0 ? ((double) completedLessons / totalLessons) * 100 : 0.0;
            progressPercent = Math.round(progressPercent * 10) / 10.0;

            String status = "NOT_STARTED";
            boolean isLocked = true;
            boolean isOverdue = timeline != null && now.isAfter(timeline);
            boolean isCompletedLessons = (totalLessons > 0 && completedLessons == totalLessons);

            if (previousModuleAllowsNext) {
                isLocked = false;

                status = progressHelper.determineModuleStatus(isCompletedLessons);

                if (!isCompletedLessons && firstUncompletedIndex == -1) {
                    firstUncompletedIndex = i;
                }
            } else {
                status = "NOT_STARTED";
                isLocked = true;
            }
            previousModuleAllowsNext = isCompletedLessons || isOverdue;

            modulesProgress.add(ModuleProgressResponse.builder()
                    .id(module.getId())
                    .title(module.getTitle())
                    .progress(progressPercent)
                    .status(status)
                    .isLocked(isLocked)
                    .sortOrder(module.getSortOrder())
                    .completedLessons((int) completedLessons)
                    .totalLessons((int) totalLessons)
                    .lessons(null)
                    .build());
        }

        // Xác định focusModuleId: module chưa hoàn thành đầu tiên, hoặc module cuối nếu
        // đã xong hết
        int focusIndex = firstUncompletedIndex;
        if (focusIndex == -1 && !modulesProgress.isEmpty()) {
            focusIndex = modulesProgress.size() - 1;
        }

        Long focusModuleId = null;
        if (focusIndex >= 0 && focusIndex < modulesProgress.size()) {
            focusModuleId = modulesProgress.get(focusIndex).getId();
        }

        return CourseProgressDashboardResponse.builder()
                .focusModuleId(focusModuleId)
                .modules(modulesProgress)
                .build();
    }

    /**
     * Module Detail API: Trả về chi tiết 1 module (lessons + partner).
     * Được gọi khi FE cần hiển thị nội dung module cụ thể.
     */
    public ModuleDetailResponse getModuleDetail(Long userId, Long classId, Long moduleId) {
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("This member does not belong to this class"));

        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("This module does not exist"));

        // Kiểm tra quyền truy cập module
        boolean isAccessible = checkModuleAccessibility(classMember, classId, module);
        if (!isAccessible) {
            throw new RuntimeException("This module is currently locked, you are not allowed to access.");
        }

        // Thống kê tiến trình của module
        long totalLessons = lessonRepository.countByModuleId(module.getId());
        long completedLessons = lessonProgressRepository
                .countCompletedLessonsByClassMemberIdAndModuleId(classMember.getId(), module.getId());

        double progressPercent = totalLessons > 0 ? ((double) completedLessons / totalLessons) * 100 : 0.0;
        progressPercent = Math.round(progressPercent * 10) / 10.0;

        boolean isCompletedAll = (totalLessons > 0 && completedLessons == totalLessons);
        String status = progressHelper.determineModuleStatus(isCompletedAll);

        // Load danh sách lessons kèm trạng thái hoàn thành
        List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(moduleId);

        List<Long> completedLessonIds = lessonProgressRepository
                .findCompletedLessonIdsByClassMemberIdAndModuleId(classMember.getId(), moduleId);
        Set<Long> completedSet = new HashSet<>(completedLessonIds);

        // Tìm partner và build response
        ClassMember partnerClassMember = groupService.findPartnerForModule(classMember, moduleId);

        PartnerResponse partnerResponse = progressHelper.buildPartnerResponse(partnerClassMember, lessons, moduleId);

        Set<Long> partnerCompletedSet = progressHelper.getPartnerCompletedSet(partnerClassMember, moduleId);
        Long partnerCurrentLessonId = progressHelper.getPartnerCurrentLessonId(lessons, partnerCompletedSet);

        // Build lesson responses kèm trạng thái partner
        List<LessonProgressResponse> lessonResponses = progressHelper.buildLessonProgressResponses(
                lessons, completedSet, partnerCompletedSet, partnerCurrentLessonId);

        return ModuleDetailResponse.builder()
                .moduleId(module.getId())
                .title(module.getTitle())
                .progress(progressPercent)
                .status(status)
                .completedLessons((int) completedLessons)
                .totalLessons((int) totalLessons)
                .lessons(lessonResponses)
                .partner(partnerResponse)
                .build();
    }

    /**
     * Kiểm tra xem learner có quyền truy cập module này không.
     * Module chỉ được truy cập nếu tất cả module trước đó đã hoàn thành hoặc đã quá
     * hạn.
     */
    private boolean checkModuleAccessibility(ClassMember classMember, Long classId, CourseModule targetModule) {
        Course course = targetModule.getCourse();
        List<CourseModule> allModules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());

        LocalDateTime now = LocalDateTime.now();
        boolean previousModuleAllowsNext = true;

        for (CourseModule module : allModules) {
            if (module.getId().equals(targetModule.getId())) {
                return previousModuleAllowsNext;
            }

            long totalLessons = lessonRepository.countByModuleId(module.getId());
            long completedLessons = lessonProgressRepository
                    .countCompletedLessonsByClassMemberIdAndModuleId(classMember.getId(), module.getId());
            boolean isCompletedLessons = (totalLessons > 0 && completedLessons == totalLessons);

            LocalDateTime timeline = classTimelineRepository.findByCourseClassIdAndModuleId(classId, module.getId());
            boolean isOverdue = timeline != null && now.isAfter(timeline);

            previousModuleAllowsNext = isCompletedLessons || isOverdue;
        }

        return false;
    }
}
