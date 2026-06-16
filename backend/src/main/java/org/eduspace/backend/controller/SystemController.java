package org.eduspace.backend.controller;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.service.SystemService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
public class SystemController {

    private final SystemService systemService;

    /**
     * API kích hoạt chạy thuật toán đóng lớp, lọc EXP và chia cặp đầu-cuối.
     * Để bảo mật, API này nên phân quyền chỉ cho ADMIN hoặc hệ thống tự quét kích
     * hoạt.
     * * URL: POST http://localhost:8080/api/system/create-class?waitlistId=1
     */
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

    @PostMapping("/match-groups")
    public ResponseEntity<APIResponse<String>> triggerMatchGroupsOnly(@RequestParam Long classId,
            @RequestParam Long moduleId) {
        try {
            systemService.splitExistingClassIntoPairs(classId, moduleId);
            return ResponseEntity
                    .ok(APIResponse.success("Chạy riêng thuật toán ghép cặp Đầu - Cuối thành công!", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(APIResponse.error(400, "Lỗi: " + e.getMessage(), null));
        }
    }

    // Endpoint test luồng xử lý dồn dịch người lẻ khi có học viên bị Drop giữa chừng
    @PostMapping("/rematch-after-drop/{classId}")
    public ResponseEntity<String> rematchAfterDrop(@PathVariable Long classId, @RequestParam Long moduleId) {
        systemService.reMatchGroupsAfterDrop(classId, moduleId);
        return ResponseEntity.ok("Xử lý dồn dịch nhóm sau khi học viên out thành công!");
    }

}