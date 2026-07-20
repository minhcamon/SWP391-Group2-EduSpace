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
import org.eduspace.backend.dto.waitlist.response.WaitlistResponse;
import org.eduspace.backend.dto.waitlist.response.WaitlistEntryResponse;
import org.springframework.beans.factory.annotation.Value;
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

        // Sĩ số tối đa của waitlist trước khi tự động tạo lớp, cấu hình ở application.properties
        @Value("${app.waitlist.capacity:10}")
        private int waitlistCapacity;

        
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

        public List<UserResponse> getMembersInWaitlist(Long courseId) {
                Waitlist activeWaitlist = waitlistRepository
                                .findByCourseIdAndStatus(courseId, WaitlistStatus.OPENING)
                                .orElse(null);

                if (activeWaitlist == null) {
                        return List.of();
                }

                List<User> members = waitlistRepository.findUsersByWaitListId(activeWaitlist.getId());

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

        
                if (currentCount >= waitlistCapacity) {
                        systemService.createClassFromWaitlist(activeWaitlist.getId());
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

                if (waitlist.getStatus() == WaitlistStatus.FULLED) {
                        throw new RuntimeException("This waitlist is full, you can no longer leave it");
                }

                waitlistRepository.deleteEntryByUserAndWaitlist(userId, waitlistId);
        }

        public List<WaitlistResponse> getCreatorWaitlists(Long creatorId) {
                List<Waitlist> waitlists = waitlistRepository.findByCreatorId(creatorId);
                return waitlists.stream()
                                .map(w -> {
                                        List<WaitlistEntry> entries = waitlistEntryRepository.findByWaitlistId(w.getId());
                                        return mapToWaitlistResponse(w, entries);
                                })
                                .toList();
        }

        public WaitlistResponse getWaitlistDetails(Long waitlistId) {
                Waitlist waitlist = waitlistRepository.findById(waitlistId)
                                .orElseThrow(() -> new RuntimeException("Waitlist not found with ID: " + waitlistId));
                
                if (waitlist.getStatus() != WaitlistStatus.OPENING) {
                        throw new RuntimeException("Hàng chờ này đã đóng hoặc đã được mở thành lớp học.");
                }

                List<WaitlistEntry> entries = waitlistEntryRepository.findByWaitlistId(waitlistId);
                return mapToWaitlistResponse(waitlist, entries);
        }

        private WaitlistResponse mapToWaitlistResponse(Waitlist waitlist, List<WaitlistEntry> entries) {
                List<WaitlistEntryResponse> students = entries.stream()
                                .map(this::mapToWaitlistEntryResponse)
                                .toList();

                return WaitlistResponse.builder()
                                .id(waitlist.getId())
                                .status(waitlist.getStatus())
                                .createdAt(waitlist.getCreatedAt())
                                .course(WaitlistResponse.CourseSummaryResponse.builder()
                                                .id(waitlist.getCourse().getId())
                                                .title(waitlist.getCourse().getTitle())
                                                .description(waitlist.getCourse().getDescription())
                                                .build())
                                .students(students)
                                .build();
        }

        @Transactional
        public Long startClassFromWaitlist(Long waitlistId) {
                Waitlist waitlist = waitlistRepository.findById(waitlistId)
                                .orElseThrow(() -> new RuntimeException("Waitlist not found"));
                if (waitlist.getStatus() == WaitlistStatus.FULLED || waitlist.getStatus() == WaitlistStatus.CLOSED) {
                        throw new RuntimeException("Hàng chờ này đã được mở lớp hoặc đã đóng");
                }

                int studentCount = waitlistEntryRepository.countByWaitlistId(waitlistId);
                if (studentCount < 2) {
                        throw new RuntimeException("Hàng chờ phải có ít nhất 2 học viên mới có thể mở lớp.");
                }

                return systemService.createClassFromWaitlist(waitlistId);
        }

        private WaitlistEntryResponse mapToWaitlistEntryResponse(WaitlistEntry entry) {
                User user = entry.getUser();
                UserResponse userResponse = UserResponse.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .fullName(user.getFullName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .avatarUrl(user.getAvatarUrl())
                                .bio(user.getBio())
                                .role(user.getRole().name())
                                .build();

                return WaitlistEntryResponse.builder()
                                .id(entry.getId())
                                .enrolledAt(entry.getEnrolledAt())
                                .user(userResponse)
                                .build();
        }
}
