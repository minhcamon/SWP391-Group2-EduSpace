package org.eduspace.backend.controller.learner;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.annotation.LearnerRoute;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@LearnerRoute
@RequiredArgsConstructor
@PreAuthorize(value = "hasRole('LEARNER')")
@Tag(name = "Learner - Course", description = "Các API dành cho Learner xem và quản lý khóa học")
public class CourseController {
    private final CourseService courseService;

    @Operation(summary = "Lấy danh sách khóa học", description = "Lấy tất cả khóa học có status = PUBLISHED và chưa bị xóa.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Tài khoản bị cấm hoặc không có quyền truy cập")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/courses")
    public ResponseEntity<APIResponse<List<CourseResponse>>> getAllPublishedCourses() {
            List<CourseResponse> courses = courseService.getAllPublishedCourses();
            return ResponseEntity.ok(
                    APIResponse.success("Successfully fetched courses", courses));
    }
}