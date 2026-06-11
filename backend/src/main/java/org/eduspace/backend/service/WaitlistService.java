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
        private final MatchingService matchingService;

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
        public String autoEnrollToWaitlist(Long courseId, Long userId) {
        
        
        boolean isAlreadyWaiting = waitlistEntryRepository.isUserAlreadyWaiting(courseId, userId);
        if (isAlreadyWaiting) {
            throw new RuntimeException("Conflict: You are already in the waitlist for this course.");
        }

        Waitlist activeWaitlist = waitlistRepository.findByCourseIdAndStatus(courseId, WaitlistStatus.OPENING)
                .orElseGet(() -> {
                    
                    Course course = courseRepository.findById(courseId)
                            .orElseThrow(() -> new RuntimeException("Data Not Found: Course not found with ID: " + courseId));
                    
                    return waitlistRepository.save(Waitlist.builder()
                            .course(course)
                            .status(WaitlistStatus.OPENING)
                            .createdAt(LocalDateTime.now())
                            .build());
                });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
                
        WaitlistEntry newEntry = WaitlistEntry.builder()
                .waitlist(activeWaitlist)
                .user(user)
                .enrolledAt(LocalDateTime.now())
                .build();
        waitlistEntryRepository.save(newEntry);

        int currentCount = waitlistEntryRepository.countByWaitlistId(activeWaitlist.getId());

        if (currentCount == 10) {
            matchingService.createClassFromWaitlist(activeWaitlist.getId());
            return "Tham gia khóa học thành công! Hàng chờ đã đủ 10 người, hệ thống đang tự động mở lớp.";
        }

        return "Tham gia khóa học thành công! Bạn đang ở trong hàng chờ (Hiện có " + currentCount + "/10 người).";
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


