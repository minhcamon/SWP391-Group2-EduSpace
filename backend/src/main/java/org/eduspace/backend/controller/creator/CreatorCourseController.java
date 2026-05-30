package org.eduspace.backend.controller.creator;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CourseResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/creator")
@RequiredArgsConstructor
@PreAuthorize(value = "hasRole('CREATOR')")
public class CreatorCourseController {
    private final CourseService courseService;

    @GetMapping("/course/my-courses")
    public ResponseEntity<APIResponse<List<CourseResponse>>> getMyCourses() {
        Long currentCreatorId = SecurityUtil.getCurrentUserId();

        List<CourseResponse> courses = courseService.getCoursesByCreatorId(currentCreatorId);

        return ResponseEntity.ok(APIResponse.success("Successfull retrieved my courses",courses));
    }
}
