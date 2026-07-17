package org.eduspace.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import java.util.List;

import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.dto.creator_request.request.AdminRejectCreatorRequest;
import org.eduspace.backend.dto.creator_request.request.CreatorRequestApprovalRequest;
import org.eduspace.backend.dto.creator_request.response.CreatorRequestApprovalResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CreatorRequestService;
import org.eduspace.backend.service.CloudinaryService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/creator-requests")
@RequiredArgsConstructor
@Tag(name = "CreatorRequest", description = "Các API gửi request nâng cấp từ Learner lên CREATOR")
@SecurityRequirement(name = "Bearer Authentication")
public class CreatorRequestController {

    private final CreatorRequestService creatorRequestService;
    private final CloudinaryService cloudinaryService;

    @Operation(summary = "Lấy danh sách yêu cầu nâng cấp lên Creator đang chờ duyệt (ADMIN)", description = "Lấy tất cả các yêu cầu đăng ký làm Creator từ Học viên đang ở trạng thái PENDING.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách yêu cầu thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<List<CreatorRequestApprovalRequest>>> getAllRequestPending() {
        List<CreatorRequestApprovalRequest> requests = creatorRequestService.getAllRequestPending();

        return ResponseEntity.ok(
                APIResponse.success("Successfull Retrieve All Pending Creator's Requests", requests));
    }

    @Operation(summary = "Lấy lịch sử yêu cầu nâng cấp lên Creator đang chờ duyệt (ADMIN)", description = "Lấy tất cả các yêu cầu đăng ký làm Creator từ Học viên.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lấy danh sách yêu cầu thành công"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<List<CreatorRequestApprovalResponse>>> getAllRequest() {
        List<CreatorRequestApprovalResponse> requests = creatorRequestService.getAllCreatorRequests();

        return ResponseEntity.ok(
                APIResponse.success("Successfull Retrieve All Creator's Requests", requests));
    }

    @Operation(summary = "Xử lý yêu cầu đồng ý làm Creator (ADMIN)", description = "Admin phê duyệt (APPROVED) yêu cầu của Học viên.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xử lý yêu cầu thành công"),
            @ApiResponse(responseCode = "400", description = "ID yêu cầu không hợp lệ hoặc trạng thái xử lý không đúng định dạng (APPROVED/REJECTED)"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @PutMapping("/{id}/approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<CreatorRequestApprovalResponse>> approveCreatorRequest(
            @PathVariable Long id) {
        Long adminId = SecurityUtil.getCurrentUserId();

        CreatorRequestApprovalResponse response = creatorRequestService.approveLearnerToCreator(id,
                adminId);

        return ResponseEntity.ok(APIResponse.success("Creator request processed successfully", response));
    }

    @Operation(summary = "Xử lý yêu cầu từ chối làm Creator (ADMIN)", description = "Admin phê duyệt (REJECTED) yêu cầu của Học viên.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Xử lý yêu cầu thành công"),
            @ApiResponse(responseCode = "400", description = "ID yêu cầu không hợp lệ hoặc trạng thái xử lý không đúng định dạng (APPROVED/REJECTED)"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Admin")
    })
    @PutMapping("/{id}/rejected")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<CreatorRequestApprovalResponse>> rejectCreatorRequest(
            @PathVariable Long id, @RequestBody AdminRejectCreatorRequest request) {
        Long adminId = SecurityUtil.getCurrentUserId();

        CreatorRequestApprovalResponse response = creatorRequestService.rejectLearnerToCreator(id,
                adminId, request.getReason());

        return ResponseEntity.ok(APIResponse.success("Creator request processed successfully", response));
    }

    @Operation(summary = "Gửi yêu cầu nâng cấp lên Creator (LEARNER)", description = "Học viên gửi đơn nâng cấp kèm tài liệu minh chứng lên Cloudinary và lưu thông tin vào hệ thống.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Gửi yêu cầu thành công"),
            @ApiResponse(responseCode = "400", description = "Dữ liệu hoặc tài liệu gửi lên không hợp lệ"),
            @ApiResponse(responseCode = "401", description = "Chưa đăng nhập hoặc token không hợp lệ"),
            @ApiResponse(responseCode = "403", description = "Không có quyền Learner")
    })
    @PostMapping(value = "/send", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('LEARNER','MENTOR')")
    public ResponseEntity<APIResponse<String>> sendCreatorRequest(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "Tài liệu minh chứng không được để trống", null));
        }

        // Validate file size (10MB max)
        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "Kích thước tài liệu không được vượt quá 10MB", null));
        }

        // Upload file to Cloudinary
        String documentUrl = cloudinaryService.uploadFile(file);

        // Lấy ID của Learner đang đăng nhập từ Security Context (tiện và bảo mật)
        Long learnerId = SecurityUtil.getCurrentUserId();

        // Gọi xuống service để xử lý lưu vào DB
        creatorRequestService.createCreatorRequest(learnerId, documentUrl);

        return ResponseEntity.ok(
                APIResponse.success(
                        "Gửi đơn đăng ký làm Creator thành công. Vui lòng chờ Admin phê duyệt!",
                        null));
    }
}
