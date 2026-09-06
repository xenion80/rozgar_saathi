package com.general_auth.opportunity.controller;

import com.general_auth.application.dto.request.ApplyRequest;
import com.general_auth.application.dto.response.ApplicationResponse;
import com.general_auth.application.service.ApplicationService;
import com.general_auth.common.response.ApiResponse;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.opportunity.dto.request.OpportunityRequest;
import com.general_auth.opportunity.dto.response.MatchResponse;
import com.general_auth.opportunity.dto.response.OpportunityMatchSummary;
import com.general_auth.opportunity.dto.response.OpportunityResponse;
import com.general_auth.opportunity.service.OpportunityService;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final OpportunityService opportunityService;
    private final ApplicationService applicationService;
    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<ApiResponse<OpportunityResponse>> create(Authentication authentication,
                                                                   @Valid @RequestBody OpportunityRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Opportunity created", opportunityService.create(user, request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OpportunityResponse>>> list(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Opportunities", opportunityService.list(user)));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<OpportunityMatchSummary>>> recommended(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        AuthUtils.requireRole(user, Role.STUDENT);
        StudentProfile profile = studentService.getOrCreateProfile(user);
        return ResponseEntity.ok(ApiResponse.success("Recommended opportunities", opportunityService.recommended(profile)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityResponse>> get(Authentication authentication, @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Opportunity details", opportunityService.get(user, id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OpportunityResponse>> update(Authentication authentication,
                                                                   @PathVariable Long id,
                                                                   @Valid @RequestBody OpportunityRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Opportunity updated", opportunityService.update(user, id, request)));
    }

    @GetMapping("/{id}/match")
    public ResponseEntity<ApiResponse<MatchResponse>> match(Authentication authentication, @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        StudentProfile profile = studentService.getOrCreateProfile(user);
        return ResponseEntity.ok(ApiResponse.success("Match score", opportunityService.getMatch(user, profile, id)));
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(Authentication authentication,
                                                                  @PathVariable Long id,
                                                                  @RequestBody(required = false) ApplyRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Application submitted", applicationService.apply(user, id, request)));
    }
}