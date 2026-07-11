package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.ClassStatus;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.*;
import org.springframework.stereotype.Service;
import org.eduspace.backend.enums.NotificationType;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemService {

    private final WaitlistRepository waitlistRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final ClassRepository classRepository;
    private final ClassMemberRepository classMemberRepository;
    private final ModuleRepository moduleRepository;
    private final ClassTimelineRepository classTimelineRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final NotificationService notificationService;

    @Transactional
    public Long createClassFromWaitlist(Long waitlistId) {

        Waitlist waitlist = waitlistRepository.findById(waitlistId)
                .orElseThrow(() -> new RuntimeException("Error: Waitlist not found."));

        waitlist.setStatus(WaitlistStatus.FULLED);
        waitlistRepository.save(waitlist);

        String generatedClassName = waitlist.getCourse().getTitle().replaceAll("\\s+", "_").toUpperCase()
                + "_B" + System.currentTimeMillis() % 1000;

        CourseClass newClass = CourseClass.builder()
                .course(waitlist.getCourse())
                .name(generatedClassName)
                .activatedAt(LocalDateTime.now())
                .status(ClassStatus.RUNNING)
                .build();
        CourseClass savedClass = classRepository.save(newClass);

        List<WaitlistEntry> allEntries = waitlistEntryRepository.findByWaitlistId(waitlistId);

        if (allEntries.size() < 10) {
            throw new RuntimeException("Error: Not enough 10 members to start the class.");
        }
        List<WaitlistEntry> entries = allEntries.subList(0, 10);

        entries.sort((a, b) -> {
            int expA = a.getUser().getTotalExp() != null ? a.getUser().getTotalExp() : 0;
            int expB = b.getUser().getTotalExp() != null ? b.getUser().getTotalExp() : 0;
            return Integer.compare(expB, expA);
        });

        List<ClassMember> savedMembers = new ArrayList<>();
        for (WaitlistEntry entry : entries) {
            ClassMember member = ClassMember.builder()
                    .courseClass(savedClass)
                    .user(entry.getUser())
                    .contextRole("LEARNER")
                    .learnerStatus(LearnerStatus.ACTIVE)
                    .rescueStartedAt(null)
                    .joinedAt(LocalDateTime.now())
                    .build();
            savedMembers.add(classMemberRepository.save(member));

            waitlistEntryRepository.delete(entry);

            notificationService.sendToUser(entry.getUser(),
                    "Khóa học " + waitlist.getCourse().getTitle() + " của bạn đã bắt đầu!",
                    NotificationType.SYSTEM,
                    savedClass.getId());
        }

        List<CourseModule> modules = moduleRepository
                .findByCourseIdOrderBySortOrder(savedClass.getCourse().getId());
        CourseModule firstModule = modules.isEmpty() ? null : modules.get(0);

        int left = 0;
        int right = savedMembers.size() - 1;
        int groupIndex = 1;

        while (left < right) {
            ClassMember proStudent = savedMembers.get(left);
            ClassMember newbieStudent = savedMembers.get(right);

            StudyGroup studyGroup = StudyGroup.builder()
                    .courseClass(savedClass)
                    .module(firstModule)
                    .chatChannelId("chat_room_g" + groupIndex + "_" + savedClass.getId())
                    .chatStatus("ACTIVE")
                    .build();
            StudyGroup savedGroup = studyGroupRepository.save(studyGroup);

            GroupMember memberLeft = GroupMember.builder()
                    .studyGroup(savedGroup)
                    .classMember(proStudent)
                    .build();
            groupMemberRepository.save(memberLeft);

            GroupMember memberRight = GroupMember.builder()
                    .studyGroup(savedGroup)
                    .classMember(newbieStudent)
                    .build();
            groupMemberRepository.save(memberRight);

            left++;
            right--;
            groupIndex++;
        }

        this.createTimelineForClass(savedClass.getId());

        return savedClass.getId();
    }

    @Transactional
    public void createTimelineForClass(Long classId) {
        if (!classTimelineRepository.findByCourseClassId(classId).isEmpty()) {
            return;
        }

        CourseClass courseClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Error: Class not found."));

        LocalDateTime anchor = courseClass.getActivatedAt() != null
                ? courseClass.getActivatedAt()
                : LocalDateTime.now();

        List<CourseModule> modules = moduleRepository
                .findByCourseIdOrderBySortOrder(courseClass.getCourse().getId());

        LocalDateTime cursor = anchor;
        for (CourseModule module : modules) {
            cursor = cursor.plusDays(module.getDays());

            ClassTimeline timeline = ClassTimeline.builder()
                    .courseClass(courseClass)
                    .module(module)
                    .dueDate(cursor)
                    .build();
            classTimelineRepository.save(timeline);
        }
    }

    @Transactional
    public void splitExistingClassIntoPairs(Long classId, Long moduleId) {
        CourseClass courseClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Error: Class not found."));
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Error: Module not found."));

        List<ClassMember> members = classMemberRepository.findByCourseClassId(classId);

        members.sort((a, b) -> {
            int expA = a.getUser().getTotalExp() != null ? a.getUser().getTotalExp() : 0;
            int expB = b.getUser().getTotalExp() != null ? b.getUser().getTotalExp() : 0;
            return Integer.compare(expB, expA);
        });

        int left = 0;
        int right = members.size() - 1;
        int groupIndex = 1;

        while (left < right) {
            StudyGroup studyGroup = StudyGroup.builder()
                    .courseClass(courseClass)
                    .module(module)
                    .chatChannelId("manual_chat_g" + groupIndex + "_" + classId)
                    .chatStatus("ACTIVE")
                    .build();
            StudyGroup savedGroup = studyGroupRepository.save(studyGroup);

            groupMemberRepository.save(GroupMember.builder().studyGroup(savedGroup)
                    .classMember(members.get(left)).build());
            groupMemberRepository.save(GroupMember.builder().studyGroup(savedGroup)
                    .classMember(members.get(right)).build());

            left++;
            right--;
            groupIndex++;
        }
    }

    @Transactional
    public void reMatchGroupsAfterDrop(Long classId, Long moduleId) {
        groupMemberRepository.deleteByLearnerStatusNotActive(classId, moduleId);

        studyGroupRepository.deleteEmptyGroups(classId, moduleId);

        List<ClassMember> orphanList = groupMemberRepository.findOrphansByClassId(classId, moduleId);

        if (!orphanList.isEmpty()) {
            groupMemberRepository.deleteByLearnerStatusNotActive(classId, moduleId);

            groupMemberRepository.deleteAllByClassMemberInAndStudyGroupCourseClassIdAndStudyGroupModuleId(
                    orphanList, classId, moduleId);

            studyGroupRepository.deleteGroupsWithSingleMember(classId, moduleId);
        }

        orphanList.sort((a, b) -> {
            int expA = a.getUser().getTotalExp() != null ? a.getUser().getTotalExp() : 0;
            int expB = b.getUser().getTotalExp() != null ? b.getUser().getTotalExp() : 0;
            return Integer.compare(expB, expA);
        });

        int n = orphanList.size();

        if (n == 1) {
            StudyGroup lowestGroup = studyGroupRepository.findAvailableGroupWithLowestExp(classId, moduleId)
                    .orElseThrow(() -> new RuntimeException(
                            "Error: Suitable group for matching not found."));

            GroupMember newMember = GroupMember.builder()
                    .studyGroup(lowestGroup)
                    .classMember(orphanList.get(0))
                    .build();
            groupMemberRepository.save(newMember);
        } else if (n == 2) {
            createCustomGroup(classId, List.of(orphanList.get(0), orphanList.get(1)));
        } else if (n == 3) {
            createCustomGroup(classId, List.of(orphanList.get(0), orphanList.get(1), orphanList.get(2)));
        } else if (n == 4) {
            createCustomGroup(classId, List.of(orphanList.get(0), orphanList.get(3)));
            createCustomGroup(classId, List.of(orphanList.get(1), orphanList.get(2)));
        } else if (n == 5) {
            createCustomGroup(classId, List.of(orphanList.get(0), orphanList.get(4)));
            createCustomGroup(classId, List.of(orphanList.get(1), orphanList.get(2), orphanList.get(3)));
        }
    }

    private void createCustomGroup(Long classId, List<ClassMember> groupMembers) {
        CourseClass courseClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Error: Class not found."));

        List<CourseModule> modules = moduleRepository
                .findByCourseIdOrderBySortOrder(courseClass.getCourse().getId());
        CourseModule currentModule = modules.isEmpty() ? null : modules.get(0);

        long timestamp = System.currentTimeMillis() % 1000;
        StudyGroup studyGroup = StudyGroup.builder()
                .courseClass(courseClass)
                .module(currentModule)
                .chatChannelId("rematch_chat_g" + timestamp + "_" + classId)
                .chatStatus("ACTIVE")
                .build();
        StudyGroup savedGroup = studyGroupRepository.save(studyGroup);

        for (ClassMember cm : groupMembers) {
            GroupMember gm = GroupMember.builder()
                    .studyGroup(savedGroup)
                    .classMember(cm)
                    .build();
            groupMemberRepository.save(gm);
        }
    }
}