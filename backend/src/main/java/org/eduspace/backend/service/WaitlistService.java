package org.eduspace.backend.service;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.entity.User;
import org.eduspace.backend.repository.WaitlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WaitlistService {
        private final WaitlistRepository waitlistRepository;

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
}
