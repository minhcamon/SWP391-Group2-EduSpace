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
import org.eduspace.backend.dto.progress.response.AssignmentProgressResponse;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.SubmissionStatus;
import org.eduspace.backend.helper.ProgressHelper;
import org.eduspace.backend.repository.AssignmentRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.ClassTimelineRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
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
  private final ProgressHelper progressHelper;
  private final StudyGroupService groupService;
  private final GroupMemberRepository groupMemberRepository;
  private final CertificateService certificateService;

  /**
   * Lấy danh sách các khóa học mà Learner ĐANG HỌC (in-progress), kèm phần trăm
   * tiến trình hoàn thành trên toàn bộ khóa học. Tiến trình tính trên cả lesson
   * và
   * assignment (assignment coi là hoàn thành khi có submission GRADED).
   * Lấy toàn bộ các khóa học (cả đang chờ, đang học và đã hoàn thành).
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

      Boolean isCompleted = (totalUnits > 0 && completedUnits >= totalUnits);

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

    return result;
  }

  public CourseProgressDashboardResponse getProgressDashboard(Long classId, Long userId, Long moduleId) {
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
          }
        }
        assignmentResponse = AssignmentProgressResponse.builder()
            .id(assignment.getId())
            .title(assignment.getTitle())
            .status(assignStatus)
            .isCompleted(assignCompleted)
            .build();
      }

      long totalUnits = totalLessons + totalAssignments;
      long completedUnits = completedLessons + completedAssignments;

      double progressPercent = totalUnits > 0 ? ((double) completedUnits / totalUnits) * 100 : 0.0;
      progressPercent = Math.round(progressPercent * 10) / 10.0;

      String status = "NOT_STARTED";
      boolean isLocked = true;
      boolean isOverdue = timeline != null && now.isAfter(timeline);
      boolean isCompletedModule = (totalUnits > 0 && completedUnits == totalUnits);

      if (previousModuleAllowsNext) {
        isLocked = false;
        status = progressHelper.determineModuleStatus(isCompletedModule);

        if (!isCompletedModule && firstUncompletedIndex == -1) {
          firstUncompletedIndex = i;
        }
      } else {
        status = "NOT_STARTED";
        isLocked = true;
      }
      previousModuleAllowsNext = isOverdue;

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
      ClassMember partnerClassMember = groupService.findPartnerForModule(classMember, module.getId());
      PartnerResponse partnerResponse = progressHelper.buildPartnerResponse(partnerClassMember, lessons,
          module.getId());

      Set<Long> partnerCompletedSet = new HashSet<>();
      Long partnerCurrentLessonId = null;

      if (partnerResponse != null) {
        partnerCompletedSet = new HashSet<>(partnerResponse.getCompletedLessons());
        if (partnerResponse.getLocation() != null) {
          partnerCurrentLessonId = partnerResponse.getLocation().getLessonId();
        }
      }

      // Build lesson responses with partner progress info
      List<LessonProgressResponse> lessonResponses = progressHelper.buildLessonProgressResponses(
          lessons, completedSet, partnerCompletedSet, partnerCurrentLessonId);

      if (isLocked) {
        lessonResponses.forEach(l -> l.setLocked(true));
      }

      Long studyGroupId = null;

      if (!isLocked && partnerClassMember != null) {
        studyGroupId = groupMemberRepository
            .findStudyGroupIdByMemberAndModule(classMember.getId(), module.getId())
            .orElse(null);
      }

      List<LessonProgressResponse> finalLessonResponses = lessonResponses;
      PartnerResponse finalPartnerResponse = isLocked ? null : partnerResponse;

      modulesProgress.add(ModuleProgressResponse.builder()
          .id(module.getId())
          .title(module.getTitle())
          .progress(progressPercent)
          .status(status)
          .isLocked(isLocked)
          .sortOrder(module.getSortOrder())
          .completedLessons((int) completedLessons)
          .totalLessons((int) totalLessons)
          .lessons(finalLessonResponses)
          .assignment(assignmentResponse)
          .partner(finalPartnerResponse)
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
    ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId).stream().findFirst()
        .orElseThrow(() -> new RuntimeException("User is not a member of this class"));

    Lesson lesson = lessonRepository.findById(lessonId)
        .orElseThrow(() -> new RuntimeException("Lesson not found"));

    // Check if the lesson belongs to the same course as the class member
    if (!lesson.getModule().getCourse().getId().equals(classMember.getCourseClass().getCourse().getId())) {
      throw new RuntimeException("Lesson does not belong to the same course as the class member");
    }

    // Mark the lesson as completed for the user
    boolean result = progressHelper.markLessonAsCompleted(lesson, classMember);
    
    // Check if the whole course is completed and issue cert & notification
    if (result) {
        certificateService.checkAndIssueCertificate(classMember);
    }
    
    return result;
  }
}
