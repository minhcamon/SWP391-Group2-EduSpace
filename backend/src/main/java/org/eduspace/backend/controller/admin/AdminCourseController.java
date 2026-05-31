package org.eduspace.backend.controller.admin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.annotation.AdminRoute;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AdminRoute
@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin - Course", description = "Các API dành cho Admin quản lý và phê duyệt khóa học")
@SecurityRequirement(name = "Bearer Authentication")
public class AdminCourseController {

    private final CourseService courseService;

    @Operation(summary = "Lấy danh sách khóa học đang chờ duyệt", description = "Trả về danh sách tất cả các khóa học có trạng thái PENDING để Admin phê duyệt.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @GetMapping("/course/pending")
    public ResponseEntity<APIResponse<List<CourseResponse>>> getPendingCourses() {

        return ResponseEntity.ok(
                APIResponse.success(
                        "Get pending courses successfully",
                        courseService.getPendingCourses()
                )
        );
    }

    @Operation(summary = "Phê duyệt khóa học", description = "Chuyển trạng thái của khóa học từ PENDING sang APPROVED.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Phê duyệt khóa học thành công"),
            @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc khóa học không ở trạng thái PENDING"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @PutMapping("/course/{id}/approve")
    public ResponseEntity<APIResponse<CourseResponse>> approveCourse(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                APIResponse.success(
                        "Course approved successfully",
                        courseService.approveCourse(id)
                )
        );
    }

    @Operation(summary = "Từ chối khóa học", description = "Chuyển trạng thái của khóa học từ PENDING sang REJECTED.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Từ chối khóa học thành công"),
            @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc khóa học không ở trạng thái PENDING"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @PutMapping("/course/{id}/reject")
    public ResponseEntity<APIResponse<CourseResponse>> rejectCourse(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                APIResponse.success(
                        "Course rejected successfully",
                        courseService.rejectCourse(id)
                )
        );
    }
}