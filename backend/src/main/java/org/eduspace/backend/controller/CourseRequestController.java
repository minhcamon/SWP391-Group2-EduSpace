package org.eduspace.backend.controller;

import java.util.List;

import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.course.response.CourseRequestHistoryResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CourseRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/course-requests")
@RequiredArgsConstructor
@Tag(name = "CourseRequest", description = "Các API Course request để course được duyệt")
@SecurityRequirement(name = "Bearer Authentication")
public class CourseRequestController {

    private final CourseRequestService courseRequestService;

    @Operation(summary = "Lấy lịch sử duyệt Course của Admin (ADMIN)", description = "Trả về danh sách các course request đã được xử lý bởi Admin hiện tại, bao gồm thông tin khóa học và người tạo.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy lịch sử duyệt thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<List<CourseRequestHistoryResponse>>> getHistoryCourseRequests() {
        Long adminId = SecurityUtil.getCurrentUserId();

        List<CourseRequestHistoryResponse> history = courseRequestService.getHistoryCourseRequestsByAdminId(adminId);

        return ResponseEntity.ok(
                APIResponse.success("Get course request history successfully", history));
    }
}
