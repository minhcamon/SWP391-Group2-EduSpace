package org.eduspace.backend.helper;

import java.util.List;
import java.util.Set;
import java.util.HashSet;

import org.eduspace.backend.dto.progress.response.LessonProgressResponse;
import org.eduspace.backend.dto.user.PartnerLocationDTO;
import org.eduspace.backend.dto.user.response.PartnerResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.LessonProgress;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.repository.LessonProgressRepository;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ProgressHelper {

  private final LessonProgressRepository lessonProgressRepository;

  /**
   * Tính toán chuỗi trạng thái hiển thị (Status) của Module dựa trên tiến độ thực
   * tế
   */
  public String determineModuleStatus(boolean isCompletedLessons) {
    if (isCompletedLessons) {
      return "COMPLETED";
    } else {
      return "IN_PROGRESS";
    }
  }

  /**
   * Xử lý và map danh sách bài học (Lessons) sang DTO kèm theo trạng thái khóa/mở
   * và vị trí của Partner
   */
  public List<LessonProgressResponse> buildLessonProgressResponses(
      List<Lesson> lessons,
      Set<Long> completedSet,
      Set<Long> partnerCompletedSet,
      Long partnerCurrentLessonId) {

    return lessons.stream().map(lesson -> {
      int currentIndex = lessons.indexOf(lesson);
      boolean isCompleted = completedSet.contains(lesson.getId());

      // Logic khóa bài học tuần tự: bài học hiện tại bị khóa nếu có bất kỳ bài phía
      // trước chưa hoàn thành
      boolean isLessonLocked = false;
      for (int k = 0; k < currentIndex; k++) {
        if (!completedSet.contains(lessons.get(k).getId())) {
          isLessonLocked = true;
          break;
        }
      }

      boolean isPartnerCurrent = partnerCurrentLessonId != null
          && partnerCurrentLessonId.equals(lesson.getId());
      boolean completedByPartner = partnerCompletedSet.contains(lesson.getId());

      return LessonProgressResponse.builder()
          .id(lesson.getId())
          .title(lesson.getTitle())
          .isCompleted(isCompleted)
          .isLocked(isLessonLocked)
          .completedByPartner(completedByPartner)
          .isPartnerCurrent(isPartnerCurrent)
          .sortOrder(lesson.getSortOrder())
          .build();
    }).toList();
  }

  /**
   * Build PartnerResponse từ partner ClassMember, tính vị trí hiện tại của
   * partner
   * trong module
   */
  public PartnerResponse buildPartnerResponse(
      ClassMember partnerClassMember,
      List<Lesson> lessons,
      Long moduleId) {

    if (partnerClassMember == null) {
      return null;
    }

    List<Long> partnerCompletedLessonIds = lessonProgressRepository
        .findCompletedLessonIdsByClassMemberIdAndModuleId(partnerClassMember.getId(), moduleId);
    Set<Long> partnerCompletedSet = new HashSet<>(partnerCompletedLessonIds);

    Long partnerCurrentLessonId = null;
    for (Lesson lesson : lessons) {
      if (!partnerCompletedSet.contains(lesson.getId())) {
        partnerCurrentLessonId = lesson.getId();
        break;
      }
    }

    String lessonName = null;
    if (partnerCurrentLessonId != null) {
      lessonName = findLessonTitle(lessons, partnerCurrentLessonId);
    } else if (lessons != null && partnerCompletedSet.size() == lessons.size() && !lessons.isEmpty()) {
      lessonName = "Làm bài tập / Hoàn thành";
    }

    User partnerUser = partnerClassMember.getUser();

    return PartnerResponse.builder()
        .partnerId(partnerUser.getId())
        .name(partnerUser.getFullName())
        .email(partnerUser.getEmail())
        .avatarUrl(partnerUser.getAvatarUrl())
        .description(partnerUser.getBio())
        .location((partnerCurrentLessonId != null || lessonName != null) ? PartnerLocationDTO.builder()
            .moduleId(moduleId)
            .lessonId(partnerCurrentLessonId)
            .lessonName(lessonName)
            .build() : null)
        .completedLessons(partnerCompletedLessonIds)
        .build();
  }

  private String findLessonTitle(List<Lesson> lessons, Long lessonId) {
    return lessons.stream()
        .filter(l -> l.getId().equals(lessonId))
        .map(Lesson::getTitle)
        .findFirst()
        .orElse("");
  }

  public boolean markLessonAsCompleted(Lesson lesson, ClassMember classMember) {
    if (lessonProgressRepository.save(
        LessonProgress.builder()
            .lesson(lesson)
            .classMember(classMember)
            .isCompleted(true)
            .build()) == null) {
      return false;
    }
    return true;
  }
}
