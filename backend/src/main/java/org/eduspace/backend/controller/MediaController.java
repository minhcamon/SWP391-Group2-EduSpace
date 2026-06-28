package org.eduspace.backend.controller;

import java.io.IOException;

import org.eduspace.backend.dto.common.APIResponse;
import org.eduspace.backend.service.CloudinaryService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@Tag(name = "Media", description = "Upload file lên Cloudinary")
public class MediaController {

    private final CloudinaryService cloudinaryService;
    
    @Operation(summary = "Upload file lên Cloudinary", description = "Nhận 1 file (multipart/form-data) và trả về secure_url sau khi upload lên Cloudinary.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Upload thành công, trả về URL của file"),
            @ApiResponse(responseCode = "400", description = "File rỗng hoặc không hợp lệ")
    })
    @PreAuthorize("hasRole('CREATOR')")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<APIResponse<String>> upload(
            @RequestParam("file") MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    APIResponse.error(400, "File is empty", null));
        }

        String url = cloudinaryService.uploadFile(file);

        return ResponseEntity.ok(APIResponse.success("Upload successfully", url));
    }
}
