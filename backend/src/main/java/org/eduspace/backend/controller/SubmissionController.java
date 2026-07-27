package org.eduspace.backend.controller;

import org.eduspace.backend.dto.assignment.request.SubmitAssignmentRequest;
import org.eduspace.backend.dto.assignment.response.SubmissionResponseDTO;
import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.submission.request.PeerReviewGradeRequest;
import org.eduspace.backend.dto.submission.response.PeerReviewAssignmentResponse;
import org.eduspace.backend.dto.submission.response.PartnerSubmissionStatusResponse;
import org.eduspace.backend.dto.submission.response.SubmissionReviewResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
@Tag(name = "Submission", description = "Các API liên quan đến quản lí trạng thái của submission (Nộp bài, lấy điểm, review)")
public class SubmissionController {

        private final SubmissionService submissionService;

        @Operation(summary = "Nộp bài tập (LEARNER)", description = "Học viên nộp bài tập cho một assignment cụ thể.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "201", description = "Nộp bài thành công"),
                        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc assignment không tồn tại"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role LEARNER)")
        })
        @PostMapping("/{classId}/assignment/submit")
        @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
        public ResponseEntity<APIResponse<SubmissionResponseDTO>> submitAssignment(
                        @PathVariable Long classId,
                        @RequestBody SubmitAssignmentRequest request) {
                Long userId = SecurityUtil.getCurrentUserId();
                SubmissionResponseDTO response = submissionService.submitAssignment(classId, userId, request);
                return new ResponseEntity<>(APIResponse.success("Nộp bài thành công", response), HttpStatus.CREATED);
        }

        @Operation(summary = "Lấy bài làm đã nộp / kết quả đánh giá bài nộp(nếu có) (LEARNER)", description = "Trả về bài làm đã nộp và chi tiết điểm số (rubrics) và nhận xét ẩn danh cho bài nộp của chính học viên đang đăng nhập.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy kết quả đánh giá thành công"),
                        @ApiResponse(responseCode = "400", description = "Không tìm thấy bài nộp hoặc bài review"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role LEARNER)")
        })
        @GetMapping("/{classId}/assignment/{assignmentId}/review")
        @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
        public ResponseEntity<APIResponse<SubmissionReviewResponse>> getSubmissionReview(
                        @PathVariable Long classId,
                        @PathVariable Long assignmentId) {

                Long userId = SecurityUtil.getCurrentUserId();
                SubmissionReviewResponse response = submissionService.getSubmissionReview(classId, userId,
                                assignmentId);
                return ResponseEntity.ok(APIResponse.success("Lấy kết quả đánh giá bài nộp thành công", response));
        }

        @Operation(summary = "Lấy bài chấm chéo được giao (LEARNER)", description = "Trả về submission mà học viên hiện tại cần chấm theo peer review.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy bài chấm chéo thành công"),
                        @ApiResponse(responseCode = "400", description = "Không tìm thấy bài chấm chéo hoặc dữ liệu không hợp lệ"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role LEARNER)")
        })
        @GetMapping("/{classId}/assignment/{assignmentId}/peer-review-assignment")
        @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
        public ResponseEntity<APIResponse<PeerReviewAssignmentResponse>> getPeerReviewAssignment(
                        @PathVariable Long classId,
                        @PathVariable Long assignmentId) {

                Long userId = SecurityUtil.getCurrentUserId();
                PeerReviewAssignmentResponse response = submissionService.getAssignedPeerReview(classId, userId,
                                assignmentId);
                return ResponseEntity.ok(APIResponse.success("Lấy bài chấm chéo thành công", response));
        }

        @Operation(summary = "Chấm bài peer review (LEARNER)", description = "Cho phép reviewer gửi điểm và nhận xét cho bài submission được giao.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Chấm bài thành công"),
                        @ApiResponse(responseCode = "400", description = "Dữ liệu không hợp lệ hoặc không có quyền chấm"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền truy cập (yêu cầu role LEARNER)")
        })
        @PostMapping("/{classId}/peer-review/{reviewId}/grade")
        @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
        public ResponseEntity<APIResponse<SubmissionReviewResponse>> gradePeerReview(
                        @PathVariable Long classId,
                        @PathVariable Long reviewId,
                        @RequestBody PeerReviewGradeRequest request) {

                Long userId = SecurityUtil.getCurrentUserId();
                SubmissionReviewResponse response = submissionService.gradePeerReview(classId, userId, reviewId,
                                request);
                return ResponseEntity.ok(APIResponse.success("Chấm bài peer review thành công", response));
        }

        @GetMapping("/{classId}/assignment/{assignmentId}/partner-submission-status")
        @PreAuthorize("hasAnyRole('LEARNER','MENTOR','CREATOR')")
        public ResponseEntity<APIResponse<PartnerSubmissionStatusResponse>> getPartnerSubmissionStatus(
                        @PathVariable Long classId,
                        @PathVariable Long assignmentId) {

                Long userId = SecurityUtil.getCurrentUserId();
                PartnerSubmissionStatusResponse response = submissionService.getPartnerSubmissionStatus(classId,
                                userId, assignmentId);
                return ResponseEntity.ok(APIResponse.success("Partner submission status fetched successfully", response));
        }
}
