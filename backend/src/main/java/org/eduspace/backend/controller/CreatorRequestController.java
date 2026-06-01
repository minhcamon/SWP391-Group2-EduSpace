package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.eduspace.backend.dto.request.CreatorRequestApprovalRequest;
import org.eduspace.backend.dto.response.APIResponse;
import org.eduspace.backend.dto.response.CreatorRequestApprovalResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CreatorRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/creator-requests")
@RequiredArgsConstructor
@Tag(name = "CreatorRequest", description = "Các API gửi request nâng cấp từ Learner lên CREATOR")
@SecurityRequirement(name = "Bearer Authentication")
public class CreatorRequestController {

        private final CreatorRequestService creatorRequestService;

        @Operation(summary = "Lấy danh sách yêu cầu nâng cấp lên Creator đang chờ duyệt (ADMIN)", description = "Lấy tất cả các yêu cầu đăng ký làm Creator từ Học viên đang ở trạng thái PENDING.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Lấy danh sách yêu cầu thành công"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
        })
        @GetMapping("/all")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<APIResponse<List<CreatorRequestApprovalRequest>>> getAllRequestPending() {
                List<CreatorRequestApprovalRequest> requests = creatorRequestService.getAllRequestPending();

                return ResponseEntity.ok(
                                APIResponse.success("Successfull Retrieve All Pending Creator's Requests", requests));
        }

        @Operation(summary = "Xử lý yêu cầu nâng cấp làm Creator (ADMIN)", description = "Admin phê duyệt (APPROVED) hoặc từ chối (REJECTED) yêu cầu của Học viên.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Xử lý yêu cầu thành công"),
                        @ApiResponse(responseCode = "400", description = "ID yêu cầu không hợp lệ hoặc trạng thái xử lý không đúng định dạng (APPROVED/REJECTED)"),
                        @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
                        @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
        })
        @PutMapping("/{requestId}/status")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<APIResponse<CreatorRequestApprovalResponse>> handleCreatorRequest(
                        @PathVariable Long requestId,
                        @RequestParam String status) {
                Long adminId = SecurityUtil.getCurrentUserId();

                CreatorRequestApprovalResponse response = creatorRequestService.approveLearnerToCreator(requestId,
                                status,
                                adminId);

                return ResponseEntity.ok(APIResponse.success("Creator request processed successfully", response));
        }
}
