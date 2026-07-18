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

                Course course = waitlist.getCourse();
                Integer minStudents = course.getMinStudentsToStart();

                List<WaitlistEntry> allEntries = waitlistEntryRepository.findByWaitlistId(waitlistId);

                // Flexible validation: use course's minimum instead of hard-coded 10
                if (allEntries.size() < minStudents) {
                        throw new RuntimeException("Error: Not enough students to start the class. Minimum required: "
                                        + minStudents);
                }

                // Take up to 10 students (or all if less than 10)
                int studentsToEnroll = Math.min(allEntries.size(), 10);
                List<WaitlistEntry> entries = allEntries.subList(0, studentsToEnroll);

                // Sort by experience (highest to lowest)
                entries.sort((a, b) -> {
                        int expA = a.getUser().getTotalExp() != null ? a.getUser().getTotalExp() : 0;
                        int expB = b.getUser().getTotalExp() != null ? b.getUser().getTotalExp() : 0;
                        return Integer.compare(expB, expA);
                });

                // Update waitlist status
                waitlist.setStatus(WaitlistStatus.FULLED);
                waitlistRepository.save(waitlist);

                // Generate class name
                String generatedClassName = course.getTitle().replaceAll("\\s+", "_").toUpperCase()
                                + "_B" + System.currentTimeMillis() % 1000;

                // Create new class
                CourseClass newClass = CourseClass.builder()
                                .course(course)
                                .name(generatedClassName)
                                .activatedAt(LocalDateTime.now())
                                .status(ClassStatus.RUNNING)
                                .build();
                CourseClass savedClass = classRepository.save(newClass);

                // Enroll students and notify
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
                                        "Khóa học " + course.getTitle() + " của bạn đã bắt đầu!",
                                        NotificationType.SYSTEM,
                                        savedClass.getId());
                }

                // Get first module for initial pairing
                List<CourseModule> modules = moduleRepository
                                .findByCourseIdOrderBySortOrder(savedClass.getCourse().getId());
                CourseModule firstModule = modules.isEmpty() ? null : modules.get(0);

                // Create study groups with improved pairing algorithm
                createStudyGroupsWithPairing(savedMembers, savedClass, firstModule);

                // Create timeline
                this.createTimelineForClass(savedClass.getId());

                return savedClass.getId();
        }

        /**
         * Create study groups by pairing pro students (high exp) with newbie students
         * (low exp)
         * Handles odd number of students by creating a 3-person group
         */
        private void createStudyGroupsWithPairing(List<ClassMember> members, CourseClass courseClass,
                        CourseModule module) {
                if (members.isEmpty()) {
                        return;
                }

                int left = 0;
                int right = members.size() - 1;
                int groupIndex = 1;
                List<StudyGroup> createdGroups = new ArrayList<>();

                // Pair students: highest exp with lowest exp
                while (left < right) {
                        ClassMember proStudent = members.get(left);
                        ClassMember newbieStudent = members.get(right);

                        StudyGroup studyGroup = StudyGroup.builder()
                                        .courseClass(courseClass)
                                        .module(module)
                                        .chatChannelId("chat_room_g" + groupIndex + "_" + courseClass.getId())
                                        .chatStatus("ACTIVE")
                                        .build();
                        StudyGroup savedGroup = studyGroupRepository.save(studyGroup);
                        createdGroups.add(savedGroup);

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

                // Handle odd number: add the middle student to the first group (highest exp
                // group)
                if (left == right && !createdGroups.isEmpty()) {
                        ClassMember middleStudent = members.get(left);
                        StudyGroup firstGroup = createdGroups.get(0);

                        GroupMember middleMember = GroupMember.builder()
                                        .studyGroup(firstGroup)
                                        .classMember(middleStudent)
                                        .build();
                        groupMemberRepository.save(middleMember);
                }
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

                // Validation: Chỉ cho phép kích hoạt khi module ngay phía trước đã được kích hoạt
                List<CourseModule> modules = moduleRepository
                                .findByCourseIdOrderBySortOrder(courseClass.getCourse().getId());
                int currentIndex = -1;
                for (int i = 0; i < modules.size(); i++) {
                        if (modules.get(i).getId().equals(moduleId)) {
                                currentIndex = i;
                                break;
                        }
                }

                if (currentIndex > 0) {
                        CourseModule prevModule = modules.get(currentIndex - 1);
                        boolean prevStarted = !studyGroupRepository
                                        .findByCourseClassIdAndModuleId(classId, prevModule.getId()).isEmpty();
                        if (!prevStarted) {
                                throw new RuntimeException("Không thể kích hoạt module này vì module trước đó (" 
                                                + prevModule.getTitle() + ") chưa được kích hoạt.");
                        }
                }

                // Validation: Không cho phép kích hoạt ghép nhóm lại nếu module này đã được chia nhóm rồi
                boolean alreadyStarted = !studyGroupRepository
                                .findByCourseClassIdAndModuleId(classId, moduleId).isEmpty();
                if (alreadyStarted) {
                        throw new RuntimeException("Module này đã được chia nhóm rồi, không thể thực hiện chia lại nhóm.");
                }

                List<ClassMember> members = classMemberRepository.findByCourseClassId(classId);

                members.sort((a, b) -> {
                        int expA = a.getUser().getTotalExp() != null ? a.getUser().getTotalExp() : 0;
                        int expB = b.getUser().getTotalExp() != null ? b.getUser().getTotalExp() : 0;
                        return Integer.compare(expB, expA);
                });

                int left = 0;
                int right = members.size() - 1;
                int groupIndex = 1;
                List<StudyGroup> createdGroups = new ArrayList<>();

                while (left < right) {
                        StudyGroup studyGroup = StudyGroup.builder()
                                        .courseClass(courseClass)
                                        .module(module)
                                        .chatChannelId("manual_chat_g" + groupIndex + "_" + classId)
                                        .chatStatus("ACTIVE")
                                        .build();
                        StudyGroup savedGroup = studyGroupRepository.save(studyGroup);
                        createdGroups.add(savedGroup);

                        groupMemberRepository.save(GroupMember.builder().studyGroup(savedGroup)
                                        .classMember(members.get(left)).build());
                        groupMemberRepository.save(GroupMember.builder().studyGroup(savedGroup)
                                        .classMember(members.get(right)).build());

                        left++;
                        right--;
                        groupIndex++;
                }

                // Handle odd student count: place the middle student (median EXP) in the first
                // group
                if (left == right && !createdGroups.isEmpty()) {
                        ClassMember middleStudent = members.get(left);
                        StudyGroup firstGroup = createdGroups.get(0);

                        groupMemberRepository.save(GroupMember.builder()
                                        .studyGroup(firstGroup)
                                        .classMember(middleStudent)
                                        .build());
                }
        }

        private void createCustomGroup(Long classId, CourseModule module, List<ClassMember> groupMembers) {
                CourseClass courseClass = classRepository.findById(classId)
                                .orElseThrow(() -> new RuntimeException("Error: Class not found."));

                long timestamp = System.currentTimeMillis() % 1000;
                StudyGroup studyGroup = StudyGroup.builder()
                                .courseClass(courseClass)
                                .module(module)
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