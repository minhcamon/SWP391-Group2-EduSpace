package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.NotificationResponse;
import org.eduspace.backend.entity.Notification;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.entity.CourseClass;
import org.eduspace.backend.entity.ClassMember;
import org.eduspace.backend.entity.WithdrawRequest;
import org.eduspace.backend.enums.NotificationType;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.enums.LearnerStatus;
import org.eduspace.backend.repository.NotificationRepository;
import org.eduspace.backend.repository.ClassMemberRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final ClassMemberRepository classMemberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendToUser(User user, String message, NotificationType type, Long referenceId) {
        Notification notification = Notification.builder()
                .recipient(user)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .build();

        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = mapToResponse(saved);

        messagingTemplate.convertAndSend("/topic/user/" + user.getId() + "/notifications", response);
    }

    @Transactional
    public void sendToRole(Role role, String message, NotificationType type, Long referenceId) {
        Notification notification = Notification.builder()
                .targetRole(role)
                .message(message)
                .type(type)
                .referenceId(referenceId)
                .build();

        Notification saved = notificationRepository.save(notification);

        NotificationResponse response = mapToResponse(saved);

        if (role == Role.ADMIN) {
            messagingTemplate.convertAndSend("/topic/admin/notifications", response);
        } else {
            messagingTemplate.convertAndSend("/topic/role/" + role.name().toLowerCase() + "/notifications", response);
        }
    }

    @Transactional
    public void sendUrgentCreatorAlert(WithdrawRequest request) {
        User creator = request.getClassMember().getCourseClass().getCourse().getCreator();
        String msg = String.format("CẢNH BÁO KHẨN CẤP: Lớp %s hiện không còn mentor hoạt động sau khi Mentor %s xin rút lui. Bạn cần chỉ định mentor mới hoặc tự tiếp quản.",
                request.getClassMember().getCourseClass().getName(),
                request.getClassMember().getUser().getFullName());
        sendToUser(creator, msg, NotificationType.SYSTEM, request.getId());
    }

    @Transactional
    public void notifyRemainingMentors(CourseClass courseClass, Long withdrawingMentorId, String withdrawingMentorName) {
        List<ClassMember> classMembers = classMemberRepository.findByCourseClassIdAndContextRole(courseClass.getId(), "MENTOR");
        for (ClassMember cm : classMembers) {
            if (cm.getLearnerStatus() == LearnerStatus.ACTIVE && !cm.getUser().getId().equals(withdrawingMentorId)) {
                String msg = String.format("Thông báo: Mentor %s đã gửi yêu cầu xin rút lui khỏi lớp %s.",
                        withdrawingMentorName,
                        courseClass.getName());
                sendToUser(cm.getUser(), msg, NotificationType.SYSTEM, courseClass.getId());
            }
        }
    }

    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(User user) {
        List<Notification> notifications = notificationRepository.findByRecipientOrTargetRoleOrderByCreatedAtDesc(user,
                user.getRole());
        return notifications.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Ensure user is authorized to read it
        if (notification.getRecipient() != null && !notification.getRecipient().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to read this notification");
        }
        if (notification.getTargetRole() != null && notification.getTargetRole() != user.getRole()) {
            throw new RuntimeException("Not authorized to read this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsReadForUser(User user) {
        notificationRepository.markAllAsReadForUserOrRole(user, user.getRole());
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .read(notification.isRead())
                .type(notification.getType().name())
                .referenceId(notification.getReferenceId())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
