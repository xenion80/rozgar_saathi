package com.general_auth.student.controller;

import com.general_auth.common.response.ApiResponse;
import com.general_auth.student.dto.response.ResumeResponse;
import com.general_auth.student.service.ResumeService;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/students/me/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {

        // Basic validation for PDF
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("File is empty"));
        }
        if (!"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().body(ApiResponse.failure("Only PDF files are allowed"));
        }

        try {
            ResumeResponse response = resumeService.uploadResume(user, file);
            return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", response));
        } catch (IllegalStateException e) {
            log.error("Cloudinary is not configured: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ApiResponse.failure("Resume upload service is not configured. Please contact support."));
        } catch (Exception e) {
            log.error("Failed to upload resume to Cloudinary", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.failure("Failed to upload resume: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> listResumes(@AuthenticationPrincipal User user) {
        List<ResumeResponse> responses = resumeService.listMyResumes(user);
        return ResponseEntity.ok(ApiResponse.success("Resumes retrieved successfully", responses));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @AuthenticationPrincipal User user,
            @PathVariable Long id) {
        resumeService.deleteResume(user, id);
        return ResponseEntity.ok(ApiResponse.success("Resume deleted successfully", null));
    }
}
