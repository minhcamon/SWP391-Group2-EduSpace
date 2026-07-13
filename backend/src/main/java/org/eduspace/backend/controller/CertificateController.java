package org.eduspace.backend.controller;

import lombok.RequiredArgsConstructor;
import org.eduspace.backend.dto.progress.response.CertificateResponse;
import org.eduspace.backend.security.SecurityUtil;
import org.eduspace.backend.service.CertificateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/certificate")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    @GetMapping("/{classId}")
    public ResponseEntity<CertificateResponse> getCertificateDetails(@PathVariable Long classId) {
        Long userId = SecurityUtil.getCurrentUserId();
        CertificateResponse response = certificateService.getCertificateDetails(classId, userId);
        return ResponseEntity.ok(response);
    }
}
