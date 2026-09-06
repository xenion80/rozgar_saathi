package com.general_auth.assessment.controller;

import com.general_auth.assessment.dto.request.AssessmentSubmitRequest;
import com.general_auth.assessment.dto.response.AssessmentResponse;
import com.general_auth.assessment.dto.response.AssessmentSubmitResponse;
import com.general_auth.assessment.service.AssessmentService;
import com.general_auth.common.response.ApiResponse;
import com.general_auth.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssessmentResponse>> view(Authentication authentication, @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Assessment details", assessmentService.view(user, id)));
    }

    @PostMapping("/{id}/start")
    public ResponseEntity<ApiResponse<AssessmentResponse>> start(Authentication authentication, @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Assessment started", assessmentService.start(user, id)));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<AssessmentSubmitResponse>> submit(Authentication authentication,
                                                                        @PathVariable Long id,
                                                                        @Valid @RequestBody AssessmentSubmitRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Assessment submitted", assessmentService.submit(user, id, request)));
    }
}