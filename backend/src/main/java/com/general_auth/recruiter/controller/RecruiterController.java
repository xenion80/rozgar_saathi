package com.general_auth.recruiter.controller;

import com.general_auth.application.dto.response.CandidateResponse;
import com.general_auth.common.response.ApiResponse;
import com.general_auth.recruiter.service.RecruiterService;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
public class RecruiterController {

    private final RecruiterService recruiterService;

    @GetMapping("/opportunities/{id}/candidates")
    public ResponseEntity<ApiResponse<List<CandidateResponse>>> candidates(Authentication authentication,
                                                                           @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Matching candidates", recruiterService.candidates(user, id)));
    }
}