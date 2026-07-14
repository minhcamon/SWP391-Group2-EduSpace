package org.eduspace.backend.controller;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.user.response.UserResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.WaitlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/waitlist")
@RequiredArgsConstructor
@Tag(name = "Waitlist", description = "Các API liên quan đến danh sách chờ (Waitlist) của khóa học")
public class WaitlistController {
    private final WaitlistService waitlistService;

    @Operation(summary = "Lấy danh sách học viên trong Waitlist", description = "Xem danh sách những người đang ở trong hàng chờ của khóa học.")
    @GetMapping("/members/{courseId}")
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
    public ResponseEntity<APIResponse<List<UserResponse>>> getMembersInWaitlist(@PathVariable Long courseId) {
        List<UserResponse> members = waitlistService.getMembersInWaitlist(courseId);
        return ResponseEntity.ok(APIResponse.success("Retrieve all members in waitlist successfully!", members));
    }

    @Operation(summary = "Rời khỏi Waitlist", description = "Học viên chủ động rời khỏi hàng chờ.")
    @DeleteMapping("/leave/{courseId}")
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
    public ResponseEntity<APIResponse<Object>> leaveWaitlist(@PathVariable Long courseId) {
        Long userId = SecurityUtil.getCurrentUserId();
        waitlistService.leaveWaitlist(userId, courseId);
        return ResponseEntity.ok(APIResponse.success("Leave waitlist successfully!", null));
    }

    @Operation(summary = "Đăng ký vào Waitlist", description = "Học viên đăng ký tham gia khóa học và đưa vào danh sách chờ.")
    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
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
