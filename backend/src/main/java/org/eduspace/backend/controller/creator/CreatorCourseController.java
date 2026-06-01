package org.eduspace.backend.controller.creator;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.annotation.CreatorRoute;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CreatorRoute
@RequiredArgsConstructor
@PreAuthorize(value = "hasRole('CREATOR')")
@Tag(name = "Creator - Course", description = "Các API dành cho Creator quản lý khóa học")
public class CreatorCourseController {
    private final CourseService courseService;

    @Operation(summary = "Lấy danh sách khóa học của tôi", description = "Lấy danh sách toàn bộ các khóa học do Creator hiện tại tạo và quản lý.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role CREATOR)")
    })
    @SecurityRequirement(name = "Bearer Authentication")
    @GetMapping("/course/my-courses")
    public ResponseEntity<APIResponse<List<CourseResponse>>> getMyCourses() {
        Long currentCreatorId = SecurityUtil.getCurrentUserId();

        List<CourseResponse> courses = courseService.getCoursesByCreatorId(currentCreatorId);

        return ResponseEntity.ok(APIResponse.success("Successfull retrieved my courses", courses));
    }
}
