package org.eduspace.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.eduspace.backend.enums.AuthProvider;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.enums.UserStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "user_id")
    private Long id;

    @Column(name = "fullname", length = 100, nullable = false, columnDefinition = "TEXT")
    private String fullName;

    @Column(name="username", length = 100, nullable = false, unique = true)
    private String username;

    @Column(name="password", length= 255, nullable = false)
    private String password;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "phone", length = 10)
    private String phone;

    @Column(name = "bio", columnDefinition = "LONGTEXT")
    private String bio;

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    private String avatarUrl;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.LEARNER; // "LEARNER", "MENTOR", "ADMIN"

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;

    @Column(name = "auth_provider")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthProvider authProvider = AuthProvider.LOCAL;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
