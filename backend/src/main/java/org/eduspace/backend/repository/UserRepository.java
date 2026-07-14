package org.eduspace.backend.repository;

import org.eduspace.backend.entity.User;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);

    Optional<User> findById(Long userId);

    Optional<User> findByEmail(String email);

    long countByRole(Role role);

    long countByStatus(UserStatus status);
}
