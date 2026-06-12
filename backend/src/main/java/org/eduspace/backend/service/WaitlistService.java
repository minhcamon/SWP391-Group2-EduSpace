package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.entity.WaitlistEntry;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.CourseRepository;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.repository.WaitlistRepository;
import org.eduspace.backend.repository.WaitlistEntryRepository;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WaitlistService {

        private final WaitlistRepository waitlistRepository;
        private final WaitlistEntryRepository waitlistEntryRepository;
        private final CourseRepository courseRepository;
        private final UserRepository userRepository;
        private final SystemService systemService;

        public List<UserResponse> getMembersInWaitlist(Long userId, Long courseId) {
                Long waitlistId = waitlistRepository.findWaitlistByUserAndCourse(userId, courseId)
                                .orElseThrow(() -> new RuntimeException("Error at finding your waitlist"));

                List<User> members = waitlistRepository.findUsersByWaitListId(waitlistId);

                return members.stream()
                                .map(member -> UserResponse.builder()
                                                .id(member.getId())
                                                .fullName(member.getFullName())
                                                .avatarUrl(member.getAvatarUrl())
                                                .build())
                                .toList();
        }

        @Transactional
        public boolean enrollToWaitlist(Long courseId, Long userId) {
                Course course = courseRepository.findByIdForUpdate(courseId)
                                .orElseThrow(() -> new RuntimeException("Course not found"));

                boolean isAlreadyWaiting = waitlistEntryRepository.isUserAlreadyWaiting(courseId, userId);
                if (isAlreadyWaiting) {
                        throw new RuntimeException("Conflict: You are already in the waitlist for this course.");
                }

                Waitlist activeWaitlist = waitlistRepository
                                .findByCourseIdAndStatus(courseId, WaitlistStatus.OPENING)
                                .orElseGet(() -> {
                                        return waitlistRepository.save(Waitlist.builder()
                                                        .course(course)
                                                        .status(WaitlistStatus.OPENING)
                                                        .createdAt(LocalDateTime.now())
                                                        .build());
                                });

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Not found any User"));

                WaitlistEntry newEntry = WaitlistEntry.builder()
                                .waitlist(activeWaitlist)
                                .user(user)
                                .enrolledAt(LocalDateTime.now())
                                .build();
                waitlistEntryRepository.save(newEntry);

                int currentCount = waitlistEntryRepository.countByWaitlistId(activeWaitlist.getId());

                if (currentCount == 10) {
                        activeWaitlist.setStatus(WaitlistStatus.FULLED);
                        systemService.createClassFromWaitlist(activeWaitlist.getId());
                        activeWaitlist.setStatus(WaitlistStatus.CLOSED);
                        return true;
                }

                return true;
        }

        @Transactional
        public void leaveWaitlist(Long userId, Long courseId) {
                Long waitlistId = waitlistRepository.findWaitlistByUserAndCourse(userId, courseId)
                                .orElseThrow(() -> new RuntimeException("You are not in the waitlist of this course"));

                Waitlist waitlist = waitlistRepository.findById(waitlistId)
                                .orElseThrow(() -> new RuntimeException("Waitlist not found"));

                if (waitlist.getStatus() == WaitlistStatus.CLOSED) {
                        throw new RuntimeException("This waitlist is closed, you can no longer leave it");
                }

                waitlistRepository.deleteEntryByUserAndWaitlist(userId, waitlistId);
        }
}
