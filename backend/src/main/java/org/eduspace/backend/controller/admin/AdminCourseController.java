package org.eduspace.backend.controller.admin;

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
public class AdminCourseController {

    private final CourseService courseService;

    @GetMapping("/course/pending")
    public ResponseEntity<APIResponse<List<CourseResponse>>> getPendingCourses() {

        return ResponseEntity.ok(
                APIResponse.success(
                        "Get pending courses successfully",
                        courseService.getPendingCourses()
                )
        );
    }

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