package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.dto.waitlist.response.WaitlistStatsResponse;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.entity.WaitlistEntry;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.CourseRepository;
import org.eduspace.backend.repository.UserRepository;
import org.eduspace.backend.repository.WaitlistRepository;
import org.eduspace.backend.repository.WaitlistEntryRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WaitlistService {

    private final WaitlistRepository waitlistRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final SystemService systemService;
    private final NotificationService notificationService;

    // Sĩ số tối đa của waitlist trước khi tự động tạo lớp, cấu hình ở
    // application.properties
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

        // Auto-start when reaching capacity (10 students)
        if (currentCount >= waitlistCapacity) {
            Long classId = systemService.createClassFromWaitlist(activeWaitlist.getId());

            // Notify creator about auto-start
            notificationService.sendToUser(
                    course.getCreator(),
                    "Your class for '" + course.getTitle() + "' has automatically started with " + waitlistCapacity
                            + " students!",
                    NotificationType.SYSTEM,
                    classId);

            activeWaitlist.setStatus(WaitlistStatus.FULLED);
            return true;
        }

        // Notify creator at milestone thresholds (6 and 8 students)
        if (currentCount == course.getMinStudentsToStart()) {
            // Reached minimum threshold (default: 6)
            notificationService.sendToUser(
                    course.getCreator(),
                    "Great news! Your waitlist for '" + course.getTitle() + "' has reached " + currentCount
                            + " students (minimum required). The class can now be started!",
                    NotificationType.WAITLIST_MILESTONE_REACHED,
                    activeWaitlist.getId());
        } else if (currentCount == 8) {
            // Reached 8 students (close to full capacity)
            notificationService.sendToUser(
                    course.getCreator(),
                    "Your waitlist for '" + course.getTitle() + "' has " + currentCount
                            + "/10 students. Only 2 more spots remaining!",
                    NotificationType.WAITLIST_MILESTONE_REACHED,
                    activeWaitlist.getId());
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

    /**
     * Get waitlist statistics for creator
     */
    public WaitlistStatsResponse getWaitlistStats(Long courseId, Long creatorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Verify creator ownership
        if (!course.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Unauthorized: You are not the creator of this course");
        }

        Waitlist activeWaitlist = waitlistRepository
                .findByCourseIdAndStatus(courseId, WaitlistStatus.OPENING)
                .orElse(null);

        if (activeWaitlist == null) {
            // No active waitlist
            return WaitlistStatsResponse.builder()
                    .waitlistId(null)
                    .courseId(courseId)
                    .courseTitle(course.getTitle())
                    .currentCount(0)
                    .minRequired(course.getMinStudentsToStart())
                    .maxCapacity(10)
                    .createdAt(null)
                    .daysElapsed(0)
                    .autoStartAfterDays(course.getAutoStartAfterDays())
                    .gracePeriodHours(course.getGracePeriodHours())
                    .canStart(false)
                    .canCancel(false)
                    .status("NO_WAITLIST")
                    .members(List.of())
                    .build();
        }

        int currentCount = waitlistEntryRepository.countByWaitlistId(activeWaitlist.getId());
        long daysElapsed = ChronoUnit.DAYS.between(activeWaitlist.getCreatedAt(), LocalDateTime.now());

        List<User> members = waitlistRepository.findUsersByWaitListId(activeWaitlist.getId());
        List<UserResponse> memberResponses = members.stream()
                .map(member -> UserResponse.builder()
                        .id(member.getId())
                        .fullName(member.getFullName())
                        .avatarUrl(member.getAvatarUrl())
                        .email(member.getEmail())
                        .build())
                .toList();

        boolean canStart = currentCount >= course.getMinStudentsToStart() && currentCount < 10;
        boolean canCancel = currentCount < 10;

        return WaitlistStatsResponse.builder()
                .waitlistId(activeWaitlist.getId())
                .courseId(courseId)
                .courseTitle(course.getTitle())
                .currentCount(currentCount)
                .minRequired(course.getMinStudentsToStart())
                .maxCapacity(10)
                .createdAt(activeWaitlist.getCreatedAt())
                .daysElapsed((int) daysElapsed)
                .autoStartAfterDays(course.getAutoStartAfterDays())
                .gracePeriodHours(course.getGracePeriodHours())
                .canStart(canStart)
                .canCancel(canCancel)
                .status(activeWaitlist.getStatus().name())
                .members(memberResponses)
                .build();
    }

    /**
     * Creator manually starts class from waitlist
     */
    @Transactional
    public Long manualStartClass(Long waitlistId, Long creatorId) {
        Waitlist waitlist = waitlistRepository.findById(waitlistId)
                .orElseThrow(() -> new RuntimeException("Waitlist not found"));

        Course course = waitlist.getCourse();

        // Verify creator ownership
        if (!course.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Unauthorized: You are not the creator of this course");
        }

        // Verify waitlist is still opening
        if (waitlist.getStatus() != WaitlistStatus.OPENING) {
            throw new RuntimeException("Waitlist is not in OPENING status");
        }

        int currentCount = waitlistEntryRepository.countByWaitlistId(waitlistId);

        // Check minimum requirement
        if (currentCount < course.getMinStudentsToStart()) {
            throw new RuntimeException(
                    "Not enough students. Current: " + currentCount + ", Required: "
                            + course.getMinStudentsToStart());
        }

        // Create class
        Long classId = systemService.createClassFromWaitlist(waitlistId);

        // Notify creator
        notificationService.sendToUser(
                course.getCreator(),
                "Your class for " + course.getTitle() + " has been started with " + currentCount
                        + " students!",
                NotificationType.SYSTEM,
                classId);

        return classId;
    }

    /**
     * Creator cancels waitlist
     */
    @Transactional
    public void cancelWaitlist(Long waitlistId, Long creatorId, String reason) {
        Waitlist waitlist = waitlistRepository.findById(waitlistId)
                .orElseThrow(() -> new RuntimeException("Waitlist not found"));

        Course course = waitlist.getCourse();

        // Verify creator ownership
        if (!course.getCreator().getId().equals(creatorId)) {
            throw new RuntimeException("Unauthorized: You are not the creator of this course");
        }

        // Verify waitlist is still opening
        if (waitlist.getStatus() != WaitlistStatus.OPENING) {
            throw new RuntimeException("Waitlist is not in OPENING status");
        }

        // Get all users in waitlist
        List<WaitlistEntry> entries = waitlistEntryRepository.findByWaitlistId(waitlistId);

        // Notify all users
        for (WaitlistEntry entry : entries) {
            notificationService.sendToUser(
                    entry.getUser(),
                    "The waitlist for course '" + course.getTitle()
                            + "' has been cancelled. Reason: " + reason,
                    NotificationType.WAITLIST_CANCELLED,
                    null);

            waitlistEntryRepository.delete(entry);
        }

        // Update waitlist status
        waitlist.setStatus(WaitlistStatus.CANCELLED);
        waitlistRepository.save(waitlist);

        // Notify creator
        notificationService.sendToUser(
                course.getCreator(),
                "You have cancelled the waitlist for " + course.getTitle() + ". " + entries.size()
                        + " students were notified.",
                NotificationType.SYSTEM,
                null);
    }
}
