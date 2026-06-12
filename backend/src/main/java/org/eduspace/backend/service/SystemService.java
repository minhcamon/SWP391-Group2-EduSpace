package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.entity.*;
import org.eduspace.backend.enums.ClassStatus;
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

        @Transactional
        public void createClassFromWaitlist(Long waitlistId) {

                Waitlist waitlist = waitlistRepository.findById(waitlistId)
                                .orElseThrow(() -> new RuntimeException("Error: Waitlist not found."));

                waitlist.setStatus(WaitlistStatus.CLOSED);
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
                                        .learnerStatus("ACTIVE")
                                        .rescueStartedAt(null)
                                        .joinedAt(LocalDateTime.now())
                                        .build();
                        classMemberRepository.save(member);
                }
        }
}
