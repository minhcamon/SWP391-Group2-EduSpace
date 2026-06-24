package org.eduspace.backend.controller;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.WaitlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
public class WaitlistController {
    private final WaitlistService waitlistService;

    @GetMapping("/members/{courseId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<APIResponse<List<UserResponse>>> getMembersInWaitlist(@PathVariable Long courseId) {
        List<UserResponse> members = waitlistService.getMembersInWaitlist(courseId);
        return ResponseEntity.ok(APIResponse.success("Retrieve all members in waitlist successfully!", members));
    }

    @DeleteMapping("/leave/{courseId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<APIResponse<Object>> leaveWaitlist(@PathVariable Long courseId) {
        Long userId = SecurityUtil.getCurrentUserId();
        waitlistService.leaveWaitlist(userId, courseId);
        return ResponseEntity.ok(APIResponse.success("Leave waitlist successfully!", null));
    }

    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('LEARNER')")
    public ResponseEntity<APIResponse<Object>> enrollWaitlist(@PathVariable Long courseId) {
        Long userId = SecurityUtil.getCurrentUserId();
        boolean check = waitlistService.enrollToWaitlist(courseId, userId);
        if (check) {
            return ResponseEntity.ok(APIResponse.success("Enroll to waitlist successfully!", null));
        }
        return ResponseEntity.badRequest()
                .body(APIResponse.error(400, "Fail to enroll to waitlist. Please try again!", null));
    }
}
