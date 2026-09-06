package com.general_auth.application.controller;

import com.general_auth.application.dto.request.ApplicationStatusRequest;
import com.general_auth.application.dto.response.ApplicationResponse;
import com.general_auth.application.service.ApplicationService;
import com.general_auth.common.response.ApiResponse;
import com.general_auth.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> myApplications(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("My applications", applicationService.myApplications(user)));
    }

    @PatchMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<ApplicationResponse>> withdraw(Authentication authentication, @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn", applicationService.withdraw(user, id)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(Authentication authentication,
                                                                         @PathVariable Long id,
                                                                         @Valid @RequestBody ApplicationStatusRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Application status updated", applicationService.updateStatus(user, id, request)));
    }
}