package org.eduspace.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.eduspace.backend.dto.course.response.CourseRequestHistoryResponse;
import org.eduspace.backend.entity.CourseRequest;
import org.eduspace.backend.repository.CourseRequestRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseRequestService {

    private final CourseRequestRepository courseRequestRepository;

    public List<CourseRequestHistoryResponse> getHistoryCourseRequestsByAdminId(Long adminId) {
        List<CourseRequest> courseRequests = courseRequestRepository.getHistoryCourseRequestsByAdminId(adminId);

        return courseRequests.stream().map(req -> CourseRequestHistoryResponse.builder()
                .courseRequestId(req.getId())
                .courseName(req.getCourse().getTitle())
                .creatorId(req.getCourse().getCreator().getId())
                .creatorName(req.getCourse().getCreator().getFullName())
                .approvedId(req.getAdminId())
                .status(req.getStatus().name())
                .processedAt(req.getProcessedAt())
                .build()).collect(Collectors.toList());
    }
}
