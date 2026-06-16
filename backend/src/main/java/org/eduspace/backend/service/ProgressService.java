package org.eduspace.backend.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.eduspace.backend.dto.progress.response.CourseProgressDashboardResponse;
import org.eduspace.backend.dto.progress.response.LessonProgressResponse;
import org.eduspace.backend.dto.progress.response.ModuleProgressResponse;
import org.eduspace.backend.dto.user.PartnerLocationDTO;
import org.eduspace.backend.dto.user.response.PartnerResponse;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.CourseModule;
import org.eduspace.backend.entity.GroupMember;
import org.eduspace.backend.entity.Lesson;
import org.eduspace.backend.entity.StudyGroup;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.eduspace.backend.repository.GroupMemberRepository;
import org.eduspace.backend.repository.LessonProgressRepository;
import org.eduspace.backend.repository.LessonRepository;
import org.eduspace.backend.repository.ModuleRepository;
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
    private final GroupMemberRepository groupMemberRepository;

    public CourseProgressDashboardResponse getProgressDashboard(Long classId, Long userId) {
        // Tìm id của ClassMember mà Learner đang trỏ tới ở class đó
        ClassMember classMember = classMemberRepository.findByUserIdAndCourseClassId(userId, classId)
                .orElseThrow(() -> new RuntimeException("Học viên không thuộc lớp học này"));

        Course course = classMember.getCourseClass().getCourse();

        // Lấy ra toàn bộ modules trong course đó
        List<CourseModule> courseModules = moduleRepository.findByCourseIdOrderBySortOrder(course.getId());

        // Đây là danh sách modules trả về sẽ gồm title, progress, trạng thái (Đã xong,
        // Đang học, Chưa bắt đầu),
        // số bài đã học/tổng số lesson và nếu chưa bắt đầu thì isLocked = true, ngược
        // lại thì false
        List<ModuleProgressResponse> modulesProgress = new ArrayList<>();

        // Đánh dấu module gần nhất mà nó đang học hoặc đã xong để lấy data lesson của
        // module
        // này còn các module kia chưa kéo data của lesson lên
        int firstUncompletedIndex = -1;

        for (int i = 0; i < courseModules.size(); i++) {
            CourseModule module = courseModules.get(i);
            long totalLessons = lessonRepository.countByModuleId(module.getId());
            long completedLessons = lessonProgressRepository
                    .countCompletedLessonsByClassMemberIdAndModuleId(classMember.getId(), module.getId());

            double progressPercent = totalLessons > 0 ? ((double) completedLessons / totalLessons) * 100 : 0.0;
            progressPercent = Math.round(progressPercent * 10) / 10.0;

            String status = "NOT_STARTED";
            boolean isLocked = true;

            if (totalLessons > 0 && completedLessons == totalLessons) {
                status = "COMPLETED";
                isLocked = false;
            } else if (firstUncompletedIndex == -1) {
                firstUncompletedIndex = i;
                status = "IN_PROGRESS";
                isLocked = false;
            } else {
                status = "NOT_STARTED";
                isLocked = true;
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
                    .lessons(null)
                    .build());
        }

        int focusIndex = firstUncompletedIndex;
        if (focusIndex == -1 && !modulesProgress.isEmpty()) {
            focusIndex = modulesProgress.size() - 1;
            if (focusIndex >= 0) {
                modulesProgress.get(focusIndex).setLocked(false);
            }
        }

        PartnerResponse partnerResponse = null;
        if (focusIndex >= 0 && focusIndex < modulesProgress.size()) {
            ModuleProgressResponse focusModuleDto = modulesProgress.get(focusIndex);
            if ("NOT_STARTED".equals(focusModuleDto.getStatus())) {
                focusModuleDto.setStatus("IN_PROGRESS");
            }

            Long focusModuleId = focusModuleDto.getId();

            List<Lesson> lessons = lessonRepository.findByModuleIdOrderBySortOrder(focusModuleId);

            List<Long> completedLessonIds = lessonProgressRepository
                    .findCompletedLessonIdsByClassMemberIdAndModuleId(classMember.getId(), focusModuleId);
            Set<Long> completedSet = new HashSet<>(completedLessonIds);

            ClassMember partnerClassMember = findPartnerForModule(classMember, focusModuleId);

            Set<Long> partnerCompletedSet = new HashSet<>();
            Long partnerCurrentLessonId = null;

            if (partnerClassMember != null) {
                List<Long> partnerCompletedLessonIds = lessonProgressRepository
                        .findCompletedLessonIdsByClassMemberIdAndModuleId(partnerClassMember.getId(), focusModuleId);
                partnerCompletedSet.addAll(partnerCompletedLessonIds);

                for (Lesson lesson : lessons) {
                    if (!partnerCompletedSet.contains(lesson.getId())) {
                        partnerCurrentLessonId = lesson.getId();
                        break;
                    }
                }

                User partnerUser = partnerClassMember.getUser();
                partnerResponse = PartnerResponse.builder()
                        .partnerId(partnerUser.getId())
                        .name(partnerUser.getFullName())
                        .avatarUrl(partnerUser.getAvatarUrl())
                        .description(partnerUser.getBio())
                        .location(partnerCurrentLessonId != null ? PartnerLocationDTO.builder()
                                .moduleId(focusModuleId)
                                .lessonId(partnerCurrentLessonId)
                                .lessonName(getLessonTitle(lessons, partnerCurrentLessonId))
                                .build() : null)
                        .build();
            }

            List<LessonProgressResponse> lessonResponses = new ArrayList<>();
            for (int j = 0; j < lessons.size(); j++) {
                Lesson lesson = lessons.get(j);
                boolean isCompleted = completedSet.contains(lesson.getId());

                boolean isLocked = false;
                if (j > 0) {
                    for (int k = 0; k < j; k++) {
                        if (!completedSet.contains(lessons.get(k).getId())) {
                            isLocked = true;
                            break;
                        }
                    }
                }

                boolean isPartnerCurrent = partnerCurrentLessonId != null
                        && partnerCurrentLessonId.equals(lesson.getId());
                boolean completedByPartner = partnerCompletedSet.contains(lesson.getId());

                lessonResponses.add(LessonProgressResponse.builder()
                        .id(lesson.getId())
                        .title(lesson.getTitle())
                        .isCompleted(isCompleted)
                        .isLocked(isLocked)
                        .completedByPartner(completedByPartner)
                        .isPartnerCurrent(isPartnerCurrent)
                        .sortOrder(lesson.getSortOrder())
                        .build());
            }

            focusModuleDto.setLessons(lessonResponses);
        }

        return CourseProgressDashboardResponse.builder()
                .partner(partnerResponse)
                .modules(modulesProgress)
                .build();
    }

    private ClassMember findPartnerForModule(ClassMember learner, Long moduleId) {
        List<GroupMember> userGroupMembers = groupMemberRepository.findByMemberId(learner.getId());

        StudyGroup studyGroup = userGroupMembers.stream()
                .map(GroupMember::getGroup)
                .filter(g -> g.getModule() != null && g.getModule().getId().equals(moduleId))
                .findFirst()
                .orElse(null);

        if (studyGroup == null) {
            return null;
        }

        List<GroupMember> groupMembers = groupMemberRepository.findByGroupId(studyGroup.getId());

        return groupMembers.stream()
                .map(GroupMember::getMember)
                .filter(m -> !m.getId().equals(learner.getId()))
                .findFirst()
                .orElse(null);
    }

    private String getLessonTitle(List<Lesson> lessons, Long lessonId) {
        return lessons.stream()
                .filter(l -> l.getId().equals(lessonId))
                .map(Lesson::getTitle)
                .findFirst()
                .orElse("");
    }

}
