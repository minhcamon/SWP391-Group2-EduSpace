package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.ClassStatus;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
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

                List<WaitlistEntry> entries = waitlistEntryRepository.findByWaitlistId(waitlistId);

                for (WaitlistEntry entry : entries) {
                        ClassMember member = ClassMember.builder()
                                        .courseClass(savedClass)
                                        .user(entry.getUser())
                                        .contextRole("LEARNER")
                                        .learnerStatus(LearnerStatus.ACTIVE)
                                        .rescueStartedAt(null)
                                        .joinedAt(LocalDateTime.now())
                                        .build();
                        classMemberRepository.save(member);
                }
                return savedClass.getId();     
        }

        /**
         * Tạo timeline cho một lớp học.
         * Lấy thời điểm kích hoạt lớp (activatedAt) làm mốc, sau đó duyệt qua các
         * module của khóa học theo sortOrder và cộng dồn số ngày (days) của từng
         * module để tính ra due date tương ứng.
         *
         * VD: mốc = 14/06, module 1 (3 ngày) -> due 17/06,
         *     module 2 (5 ngày) -> due 22/06, ...
         */
        @Transactional
        public void createTimelineForClass(Long classId) {

                if (!classTimelineRepository.findByCourseClassId(classId).isEmpty()) {
                        return; // hoặc xóa cũ rồi tạo lại
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
}
