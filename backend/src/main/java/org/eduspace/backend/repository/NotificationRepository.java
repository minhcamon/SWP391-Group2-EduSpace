package org.eduspace.backend.repository;

import org.eduspace.backend.entity.Notification;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE n.recipient = :user OR n.targetRole = :role ORDER BY n.createdAt DESC")
    List<Notification> findByRecipientOrTargetRoleOrderByCreatedAtDesc(@Param("user") User user, @Param("role") Role role);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient = :user OR n.targetRole = :role")
    void markAllAsReadForUserOrRole(@Param("user") User user, @Param("role") Role role);

}
