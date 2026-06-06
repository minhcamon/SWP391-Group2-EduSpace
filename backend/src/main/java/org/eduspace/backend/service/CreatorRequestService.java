package org.eduspace.backend.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.eduspace.backend.dto.creator_request.request.CreatorRequestApprovalRequest;
import org.eduspace.backend.dto.creator_request.response.CreatorRequestApprovalResponse;
import org.eduspace.backend.entity.CreatorRequest;
import org.eduspace.backend.enums.RequestStatus;
import org.eduspace.backend.enums.Role;
import org.eduspace.backend.repository.CreatorRequestRepository;
import org.eduspace.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.eduspace.backend.entity.User;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CreatorRequestService {
        private final CreatorRequestRepository creatorRequestRepository;
        private final UserRepository userRepository;

        public List<CreatorRequestApprovalRequest> getAllRequestPending() {
                List<CreatorRequest> requests = creatorRequestRepository.findByStatus(RequestStatus.PENDING);

                return requests.stream()
                                .map(request -> CreatorRequestApprovalRequest.builder()
                                                .requestId(request.getId())
                                                .learnerId(request.getLearner().getId())
                                                .learnerName(request.getLearner().getFullName())
                                                .learnerEmail(request.getLearner().getEmail())
                                                .documentUrl(request.getDocumentUrl())
                                                .status(request.getStatus().name())
                                                .build())
                                .collect(Collectors.toList());

        }

        @Transactional
        public CreatorRequestApprovalResponse approveLearnerToCreator(Long requestId, Long adminId) {
                CreatorRequest request = creatorRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Creator request not found with ID: " + requestId));

                if (request.getStatus() != RequestStatus.PENDING) {
                        throw new RuntimeException("This request has already been processed");
                }
                request.setStatus(RequestStatus.APPROVED);
                request.getLearner().setRole(Role.CREATOR);

                CreatorRequest updatedRequest = creatorRequestRepository.save(request);

                return CreatorRequestApprovalResponse.builder()
                                .id(updatedRequest.getId())
                                .status(updatedRequest.getStatus().name())
                                .learnerId(updatedRequest.getLearner() != null ? updatedRequest.getLearner().getId()
                                                : null)
                                .approvedBy(adminId)
                                .processedAt(LocalDateTime.now())
                                .build();
        }

        @Transactional
        public CreatorRequestApprovalResponse rejectLearnerToCreator(Long requestId, Long adminId, String reason) {
                CreatorRequest request = creatorRequestRepository.findById(requestId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Creator request not found with ID: " + requestId));

                if (request.getStatus() != RequestStatus.PENDING) {
                        throw new RuntimeException("This request has already been processed");
                }
                request.setStatus(RequestStatus.REJECTED);
                request.setReason(reason);

                CreatorRequest updatedRequest = creatorRequestRepository.save(request);

                return CreatorRequestApprovalResponse.builder()
                                .id(updatedRequest.getId())
                                .status(updatedRequest.getStatus().name())
                                .learnerId(updatedRequest.getLearner() != null ? updatedRequest.getLearner().getId()
                                                : null)
                                .approvedBy(adminId)
                                .processedAt(LocalDateTime.now())
                                .reason(updatedRequest.getReason())
                                .build();
        }

        @Transactional
        public void createCreatorRequest(Long learnerId) {

                User learner = userRepository.findById(learnerId)
                                .orElseThrow(() -> new RuntimeException(
                                                "User (Learner) not found with ID: " + learnerId));

                boolean hasPendingRequest = creatorRequestRepository.existsByLearnerAndStatus(learner,
                                RequestStatus.PENDING);
                if (hasPendingRequest) {
                        throw new RuntimeException("Bạn đã có một yêu cầu đang chờ duyệt. Không thể gửi thêm!");
                }

                CreatorRequest newRequest = CreatorRequest.builder()
                                .learner(learner)
                                .status(RequestStatus.PENDING)
                                .build();

                creatorRequestRepository.save(newRequest);
        }

        @Transactional
        public List<CreatorRequestApprovalResponse> getAllCreatorRequests() {
                List<CreatorRequest> requests = creatorRequestRepository.findAllByOrderByIdDesc();

                List<CreatorRequestApprovalResponse> responseList = new ArrayList<>();

                for (CreatorRequest req : requests) {
                        Long adminId = null;
                        if (req.getApprovedBy() != null) {
                                adminId = req.getApprovedBy().getId();
                        }

                        CreatorRequestApprovalResponse res = CreatorRequestApprovalResponse.builder()
                                        .id(req.getId())
                                        .learnerId(req.getLearner().getId())
                                        .learnerName(req.getLearner().getFullName())
                                        .learnerEmail(req.getLearner().getEmail())
                                        .approvedBy(adminId)
                                        .processedAt(req.getProcessedAt())
                                        .status(req.getStatus().name())
                                        .build();

                        responseList.add(res);
                }
                return responseList;
        }

}
