package org.eduspace.backend.controller;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.assignment.request.SubmitAssignmentRequest;
import org.eduspace.backend.dto.assignment.response.SubmissionResponseDTO;
import org.eduspace.backend.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/submit/{learnerId}")
    public ResponseEntity<SubmissionResponseDTO> submitAssignment(
            @PathVariable Long learnerId,
            @RequestBody SubmitAssignmentRequest request) {

        SubmissionResponseDTO response = submissionService.submitAssignment(learnerId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}