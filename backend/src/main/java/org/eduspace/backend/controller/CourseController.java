package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.eduspace.backend.dto.request.AdminRejectCourseRequest;
import org.eduspace.backend.dto.request.CreateCourseRequest;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
@Tag(name = "Course", description = "Quản lý khóa học")
public class CourseController {

        private final CourseService courseService;

        // ADMIN
        @Operation(summary = "Lấy danh sách khóa học đang chờ duyệt (ADMIN)", description = "Trả về danh sách tất cả các khóa học có trạng thái PENDING để Admin phê duyệt.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
        })
        @GetMapping("/pending")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<APIResponse<List<CourseResponse>>> getPendingCourses() {

                return ResponseEntity.ok(
                                APIResponse.success(
                                                "Get pending courses successfully",
                                                courseService.getPendingCourses()));
        }

        @Operation(summary = "Phê duyệt khóa học (ADMIN)", description = "Chuyển trạng thái của khóa học từ PENDING sang APPROVED.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Phê duyệt khóa học thành công"),
                        @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc khóa học không ở trạng thái PENDING"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
        })
        @PutMapping("/{id}/approve")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<APIResponse<CourseResponse>> approveCourse(
                        @PathVariable Long id,
                        @RequestParam Long adminId) {

                return ResponseEntity.ok(
                                APIResponse.success(
                                                "Course approved successfully",
                                                courseService.approveCourse(id, adminId)));
        }

        @Operation(summary = "Từ chối khóa học (ADMIN)", description = "Chuyển trạng thái của khóa học từ PENDING sang REJECTED.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Từ chối khóa học thành công"),
                        @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc khóa học không ở trạng thái PENDING"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
        })
        @PutMapping("/{id}/reject")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<APIResponse<CourseResponse>> rejectCourse(
                        @PathVariable Long id,
                        @RequestBody AdminRejectCourseRequest request) {

                return ResponseEntity.ok(
                                APIResponse.success(
                                                "Course rejected successfully",
                                                courseService.rejectCourse(id, request)));
        }

        // ---------------CREATOR-----------------
        @Operation(summary = "Lấy danh sách khóa học của tôi (CREATOR)", description = "Lấy danh sách toàn bộ các khóa học do Creator hiện tại tạo và quản lý.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
                        @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role CREATOR)")
        })
        @GetMapping("/my-courses")
        @PreAuthorize("hasRole('CREATOR')")
        public ResponseEntity<APIResponse<List<CourseResponse>>> getMyCourses() {
                Long currentCreatorId = SecurityUtil.getCurrentUserId();

                List<CourseResponse> courses = courseService.getCoursesByCreatorId(currentCreatorId);

                return ResponseEntity.ok(APIResponse.success("Successfull retrieved my courses", courses));
        }

        @Operation(summary = "Tạo khóa học (CREATOR)", description = "Tạo một khóa học mới do Creator hiện tại tạo.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Tạo khóa học thành công"),
                        @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role CREATOR)")
        })
        @PostMapping("/create-course")
        @PreAuthorize("hasRole('CREATOR')")
        public ResponseEntity<APIResponse<Long>> createCourse(
                        @RequestBody CreateCourseRequest request) {
                Long creatorId = SecurityUtil.getCurrentUserId();
                Long courseId = courseService.createCourse(request, creatorId);

                return ResponseEntity.ok(
                                APIResponse.success("Course created successfully", courseId));
        }

        // Public
        @Operation(summary = "Lấy danh sách khóa học", description = "Lấy tất cả khóa học có status = PUBLISHED và chưa bị xóa.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
        })
        @GetMapping("/all")
        public ResponseEntity<APIResponse<List<CourseResponse>>> getAllPublishedCourses() {
                List<CourseResponse> courses = courseService.getAllPublishedCourses();
                return ResponseEntity.ok(
                                APIResponse.success("Successfully fetched courses", courses));
        }

        @Operation(summary = "Lấy chi tiết khóa học theo ID", description = "Lấy thông tin chi tiết khóa học bao gồm modules, lessons và assignments.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy khóa học thành công"),
                        @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc khóa học không tồn tại"),
        })
        @GetMapping("/{id}")
        public ResponseEntity<APIResponse<CourseResponse>> getCourseById(
                        @PathVariable Long id) {
                CourseResponse course = courseService.getCourseById(id);
                return ResponseEntity.ok(
                                APIResponse.success("Course retrieved successfully", course));
        }

}
