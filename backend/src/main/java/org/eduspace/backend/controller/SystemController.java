package org.eduspace.backend.controller;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.service.SystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
@Tag(name = "System", description = "Các API nội bộ hệ thống dùng để chạy trigger, test thuật toán")
public class SystemController {

    private final SystemService systemService;

    /**
     * API kích hoạt chạy thuật toán đóng lớp, lọc EXP và chia cặp đầu-cuối.
     * Để bảo mật, API này nên phân quyền chỉ cho ADMIN hoặc hệ thống tự quét kích
     * hoạt.
     * * URL: POST http://localhost:8080/api/system/create-class?waitlistId=1
     */
    @Operation(summary = "Kích hoạt thuật toán đóng lớp", description = "Tạo lớp học mới từ danh sách chờ, lọc EXP và chia nhóm.")
    @PostMapping("/create-class")
    @PreAuthorize("hasRole('ADMIN')") // Phân quyền Admin được phép trigger test bằng tay
    public ResponseEntity<APIResponse<Long>> triggerCreateClassFromWaitlist(@RequestParam Long waitlistId) {
        try {
            Long classId = systemService.createClassFromWaitlist(waitlistId);
            return ResponseEntity.ok(
                    APIResponse.success("Tạo lớp, dọn dẹp hàng chờ và ghép cặp học viên thành công!", classId));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(APIResponse.error(400, "Thất bại: " + e.getMessage(), null));
        }
    }

    @Operation(summary = "Ghép lại nhóm cho lớp học", description = "Chia cặp Đầu - Cuối cho các thành viên trong lớp ở module tương ứng. Nếu lẻ thì dồn người lẻ vào nhóm đầu.")
    @PostMapping("/rematch-group/{classId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CREATOR')")
    public ResponseEntity<APIResponse<String>> rematchGroup(
            @PathVariable Long classId,
            @RequestParam Long moduleId) {
        try {
            systemService.splitExistingClassIntoPairs(classId, moduleId);
            return ResponseEntity
                    .ok(APIResponse.success("Tạo lại nhóm học viên thành công!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(APIResponse.error(400, "Lỗi: " + e.getMessage(), null));
        }
    }
}