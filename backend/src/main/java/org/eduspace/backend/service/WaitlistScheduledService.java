package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eduspace.backend.entity.Course;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.Waitlist;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.WaitlistStatus;
import org.eduspace.backend.repository.WaitlistEntryRepository;
import org.eduspace.backend.repository.WaitlistRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class WaitlistScheduledService {

    private final WaitlistRepository waitlistRepository;
    private final WaitlistEntryRepository waitlistEntryRepository;
    private final SystemService systemService;
    private final NotificationService notificationService;

    /**
     * Scheduled job runs every day at 9:00 AM
     * Checks waitlists that have passed their autoStartAfterDays threshold
     * Sends notifications to creators about waitlist status
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkWaitlistsForNotification() {
        log.info("Running scheduled job: checkWaitlistsForNotification at {}", LocalDateTime.now());

        List<Waitlist> openingWaitlists = waitlistRepository.findByStatus(WaitlistStatus.OPENING);

        for (Waitlist waitlist : openingWaitlists) {
            try {
                processWaitlistNotification(waitlist);
            } catch (Exception e) {
                log.error("Error processing waitlist notification for waitlist ID: {}", waitlist.getId(), e);
            }
        }

        log.info("Completed scheduled job: checkWaitlistsForNotification");
    }

    /**
     * Scheduled job runs every day at 9:00 PM (12 hours after first check)
     * Auto-starts classes or auto-cancels waitlists based on grace period
     */
    @Scheduled(cron = "0 0 21 * * *")
    @Transactional
    public void checkWaitlistsForAutoAction() {
        log.info("Running scheduled job: checkWaitlistsForAutoAction at {}", LocalDateTime.now());

        List<Waitlist> openingWaitlists = waitlistRepository.findByStatus(WaitlistStatus.OPENING);

        for (Waitlist waitlist : openingWaitlists) {
            try {
                processWaitlistAutoAction(waitlist);
            } catch (Exception e) {
                log.error("Error processing waitlist auto-action for waitlist ID: {}", waitlist.getId(), e);
            }
        }

        log.info("Completed scheduled job: checkWaitlistsForAutoAction");
    }

    /**
     * Process individual waitlist for notification (morning check)
     */
    private void processWaitlistNotification(Waitlist waitlist) {
        Course course = waitlist.getCourse();
        User creator = course.getCreator();

        long daysElapsed = ChronoUnit.DAYS.between(waitlist.getCreatedAt(), LocalDateTime.now());

        // Check if waitlist has reached the threshold (e.g., 2 days)
        if (daysElapsed < course.getAutoStartAfterDays()) {
            return; // Not yet time
        }

        int currentCount = waitlistEntryRepository.countByWaitlistId(waitlist.getId());
        int minRequired = course.getMinStudentsToStart();

        if (currentCount >= minRequired && currentCount < 10) {
            // Case 1: Ready to start (6-9 students)
            String message = String.format(
                    "Your waitlist for '%s' has %d students (min: %d). " +
                            "You can start the class now or it will auto-start in %d hours.",
                    course.getTitle(),
                    currentCount,
                    minRequired,
                    course.getGracePeriodHours());

            notificationService.sendToUser(
                    creator,
                    message,
                    NotificationType.WAITLIST_READY_TO_START,
                    waitlist.getId());

            log.info("Sent READY_TO_START notification for waitlist ID: {} with {} students", 
                    waitlist.getId(), currentCount);

        } else if (currentCount < minRequired) {
            // Case 2: Not enough students
            String message = String.format(
                    "Your waitlist for '%s' only has %d students (min: %d). " +
                            "Consider cancelling or it will auto-cancel in %d hours if not enough students join.",
                    course.getTitle(),
                    currentCount,
                    minRequired,
                    course.getGracePeriodHours());

            notificationService.sendToUser(
                    creator,
                    message,
                    NotificationType.WAITLIST_READY_TO_START,
                    waitlist.getId());

            log.info("Sent LOW_ENROLLMENT notification for waitlist ID: {} with {} students", 
                    waitlist.getId(), currentCount);
        }
        // If currentCount >= 10, it should have already auto-started
    }

    /**
     * Process individual waitlist for auto-action (evening check, after grace period)
     */
    private void processWaitlistAutoAction(Waitlist waitlist) {
        Course course = waitlist.getCourse();
        User creator = course.getCreator();

        long daysElapsed = ChronoUnit.DAYS.between(waitlist.getCreatedAt(), LocalDateTime.now());
        long hoursElapsed = ChronoUnit.HOURS.between(waitlist.getCreatedAt(), LocalDateTime.now());

        // Calculate threshold: autoStartAfterDays + gracePeriodHours
        long thresholdHours = (course.getAutoStartAfterDays() * 24L) + course.getGracePeriodHours();

        if (hoursElapsed < thresholdHours) {
            return; // Grace period not yet elapsed
        }

        int currentCount = waitlistEntryRepository.countByWaitlistId(waitlist.getId());
        int minRequired = course.getMinStudentsToStart();

        if (currentCount >= minRequired && currentCount < 10) {
            // Auto-start the class
            try {
                Long classId = systemService.createClassFromWaitlist(waitlist.getId());

                String message = String.format(
                        "Your class for '%s' has been automatically started with %d students!",
                        course.getTitle(),
                        currentCount);

                notificationService.sendToUser(
                        creator,
                        message,
                        NotificationType.SYSTEM,
                        classId);

                log.info("Auto-started class ID: {} from waitlist ID: {} with {} students", 
                        classId, waitlist.getId(), currentCount);

            } catch (Exception e) {
                log.error("Failed to auto-start class from waitlist ID: {}", waitlist.getId(), e);
            }

        } else if (currentCount < minRequired) {
            // Auto-cancel the waitlist
            try {
                waitlist.setStatus(WaitlistStatus.CANCELLED);
                waitlistRepository.save(waitlist);

                String creatorMessage = String.format(
                        "Your waitlist for '%s' has been automatically cancelled due to insufficient enrollment (%d/%d students).",
                        course.getTitle(),
                        currentCount,
                        minRequired);

                notificationService.sendToUser(
                        creator,
                        creatorMessage,
                        NotificationType.WAITLIST_CANCELLED,
                        null);

                // Notify all learners in waitlist
                List<User> learners = waitlistRepository.findUsersByWaitListId(waitlist.getId());
                for (User learner : learners) {
                    String learnerMessage = String.format(
                            "The waitlist for course '%s' has been cancelled due to insufficient enrollment.",
                            course.getTitle());

                    notificationService.sendToUser(
                            learner,
                            learnerMessage,
                            NotificationType.WAITLIST_CANCELLED,
                            null);
                }

                log.info("Auto-cancelled waitlist ID: {} with only {} students (min: {})", 
                        waitlist.getId(), currentCount, minRequired);

            } catch (Exception e) {
                log.error("Failed to auto-cancel waitlist ID: {}", waitlist.getId(), e);
            }
        }
    }
}
