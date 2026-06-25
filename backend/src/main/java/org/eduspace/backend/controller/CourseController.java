package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.eduspace.backend.dto.course.request.AdminRejectCourseRequest;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.course.request.CreateCourseRequest;
import org.eduspace.backend.dto.course.request.UpdateCourseRequest;
import org.eduspace.backend.dto.course.response.CourseProgressResponse;
import org.eduspace.backend.dto.course.response.CourseResponse;
import org.eduspace.backend.dto.progress.response.CourseProgressDashboardResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CourseService;
import org.eduspace.backend.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/course")
@RequiredArgsConstructor
@Tag(name = "Course", description = "Quản lý khóa học")
public class CourseController {
  private final CourseService courseService;
  private final ProgressService progressService;

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
      @PathVariable Long id) {

    Long adminId = SecurityUtil.getCurrentUserId();

    CourseResponse response = courseService.approveCourse(id, adminId);

    return ResponseEntity.ok(APIResponse.success("Approve course successfully", response));
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

    Long adminId = SecurityUtil.getCurrentUserId();

    CourseResponse response = courseService.rejectCourse(id, adminId, request);
    return ResponseEntity.ok(APIResponse.success("Reject course successfully", response));
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

  @Operation(summary = "Cập nhật khóa học (CREATOR)", description = "Cập nhật tiêu đề hoặc mô tả khóa học. Chỉ có thể cập nhật khóa học ở trạng thái DRAFT hoặc REJECTED.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Cập nhật khóa học thành công"),
      @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc không có quyền"),
      @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
      @ApiResponse(responseCode = "403", description = "Không có quyền CREATOR")
  })
  @PutMapping("/{id}/update")
  @PreAuthorize("hasRole('CREATOR')")
  public ResponseEntity<APIResponse<CourseResponse>> updateCourse(
      @PathVariable Long id,
      @RequestBody UpdateCourseRequest request) {
    Long creatorId = SecurityUtil.getCurrentUserId();
    boolean isUpdated = courseService.updateCourse(id, request, creatorId);

    if (!isUpdated) {
      return ResponseEntity.badRequest().build();
    }

    return ResponseEntity.ok(
        APIResponse.success("Course updated successfully", null));
  }

  // ADMIN + CREATOR
  @Operation(summary = "Xóa khóa học (CREATOR, ADMIN)")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Xóa thành công"),
      @ApiResponse(responseCode = "400", description = "ID khóa học không hợp lệ hoặc không có quyền"),
      @ApiResponse(responseCode = "401", description = "Chưa xác thực hoặc token không hợp lệ"),
      @ApiResponse(responseCode = "403", description = "Không có quyền CREATOR hoặc ADMIN")
  })
  @PreAuthorize("hasAnyRole('CREATOR', 'ADMIN')")
  @DeleteMapping("/{id}/delete")
  public ResponseEntity<APIResponse<Object>> deleteCourse(@PathVariable("id") Long courseId) {
    courseService.deleteCourse(courseId);
    return ResponseEntity.ok(APIResponse.success("Deleted successfully", null));
  }

  // Public
  @Operation(summary = "Lấy danh sách khóa học", description = "Lấy tất cả khóa học có status = PUBLISHED và chưa bị xóa.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học thành công"),
  })
  @GetMapping("/all")
  public ResponseEntity<APIResponse<List<CourseResponse>>> getAllPublishedCourses() {
    Long currentUserId = SecurityUtil.getCurrentUserIdAndAllowNull();

    List<CourseResponse> courses = courseService.getAllPublishedCourses(currentUserId);
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

  // ---------------LEARNER-----------------
  @Operation(summary = "Lấy danh sách khóa học đang học (LEARNER)", description = "Trả về danh sách các khóa học mà Learner hiện tại đang tham gia kèm phần trăm tiến trình hoàn thành, dùng cho trang 'Khóa học của tôi'.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy danh sách khóa học đang học thành công"),
      @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
      @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role LEARNER)")
  })
  @GetMapping("/my-learning/in-progress")
  @PreAuthorize("hasRole('LEARNER')")
  public ResponseEntity<APIResponse<List<CourseProgressResponse>>> getMyLearningCourses() {

    Long userId = SecurityUtil.getCurrentUserId();

    List<CourseProgressResponse> response = progressService.getInProgressCourses(userId);

    return ResponseEntity.ok(
        APIResponse.success("Get in-progress courses successfully", response));
  }

  @Operation(summary = "Dashboard tiến trình học tập của Learner (LEARNER)", description = "Trả về tiến trình các module, bài học và thông tin bạn đồng hành cho module tiêu điểm hiện tại.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy tiến trình thành công"),
      @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
      @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
  })
  @GetMapping("/enroll/{classId}/dashboard")
  @PreAuthorize("hasRole('LEARNER')")
  public ResponseEntity<APIResponse<CourseProgressDashboardResponse>> getProgressDashboard(
      @PathVariable Long classId) {

    Long userId = SecurityUtil.getCurrentUserId();

    CourseProgressDashboardResponse response = progressService.getProgressDashboard(classId, userId, null);

    return ResponseEntity.ok(
        APIResponse.success("Get progress dashboard successfully", response));
  }

  @Operation(summary = "Sidebar tiến trình học tập của Learner (LEARNER)", description = "Trả về tiến trình các module, bài học và thông tin bạn đồng hành cho module tiêu điểm hiện tại.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Lấy tiến trình thành công"),
      @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
      @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
  })
  @GetMapping("/enroll/{classId}/learning/{moduleId}")
  @PreAuthorize("hasRole('LEARNER')")
  public ResponseEntity<APIResponse<CourseProgressDashboardResponse>> getProgressSidebarLearningSpace(
      @PathVariable Long classId, @PathVariable Long moduleId) {

    Long userId = SecurityUtil.getCurrentUserId();

    CourseProgressDashboardResponse response = progressService.getProgressDashboard(classId, userId,
        moduleId);

    return ResponseEntity.ok(
        APIResponse.success("Get progress dashboard successfully", response));
  }

  @Operation(summary = "Hoàn thành bài học (LEARNER)", description = "Đánh dấu một bài học là đã hoàn thành cho người dùng.")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "200", description = "Hoàn thành bài học thành công"),
      @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
      @ApiResponse(responseCode = "403", description = "Không có quyền truy cập")
  })
  @PostMapping("/lessons/{lessonId}/complete")  
  @PreAuthorize("hasRole('LEARNER')")
  public ResponseEntity<APIResponse<?>> completeLesson(@PathVariable Long lessonId, @RequestBody Long classId) {
    Long userId = SecurityUtil.getCurrentUserId();
    progressService.completeLesson(lessonId, userId, classId);
    return ResponseEntity.ok(APIResponse.success("Lesson completed successfully", null));
  }
}
