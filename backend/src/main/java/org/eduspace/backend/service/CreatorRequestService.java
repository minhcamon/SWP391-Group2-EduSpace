package org.eduspace.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.request.CreatorRequestApprovalRequest;
import org.eduspace.backend.dto.response.CreatorRequestApprovalResponse;
import org.eduspace.backend.entity.CreatorRequest;
import org.eduspace.backend.enums.CreatorRequestStatus;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.repository.CreatorRequestRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreatorRequestService {
    private final CreatorRequestRepository creatorRequestRepository;

    public List<CreatorRequestApprovalRequest> getAllRequestPending(){
        List<CreatorRequest> requests = creatorRequestRepository.findByStatus(CreatorRequestStatus.PENDING);

        return requests.stream()
                .map(request->CreatorRequestApprovalRequest.builder()
                        .learnerId(request.getId())
                        .learnerName(request.getLearner().getFullName())
                        .documentUrl(request.getDocumentUrl())
                        .build())
                .collect(Collectors.toList());

    }

    @Transactional
    public CreatorRequestApprovalResponse approveLearnerToCreator(Long requestId, String status, Long adminId) {
        CreatorRequest request = creatorRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Creator request not found with ID: " + requestId));

        if (request.getStatus() != CreatorRequestStatus.PENDING) {
            throw new RuntimeException("This request has already been processed");
        }

        CreatorRequestStatus targetStatus;
        try {
            targetStatus = CreatorRequestStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status provided. Expected APPROVED or REJECTED");
        }

        if (targetStatus == CreatorRequestStatus.APPROVED) {
            request.setStatus(CreatorRequestStatus.APPROVED);
            if (request.getLearner() != null) {
                request.getLearner().setRole(Role.CREATOR);
            }
        } else if (targetStatus == CreatorRequestStatus.REJECTED) {
            request.setStatus(CreatorRequestStatus.REJECTED);
        }

        CreatorRequest updatedRequest = creatorRequestRepository.save(request);

        return CreatorRequestApprovalResponse.builder()
                .id(updatedRequest.getId())
                .status(updatedRequest.getStatus().name())
                .learnerId(updatedRequest.getLearner() != null ? updatedRequest.getLearner().getId() : null)
                .approvedBy(adminId)
                .processedAt(LocalDateTime.now())
                .build();
    }
}
