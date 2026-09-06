package com.general_auth.student.controller;

import com.general_auth.common.response.ApiResponse;
import com.general_auth.common.security.AuthUtils;
import com.general_auth.skill.dto.response.SkillGapResponse;
import com.general_auth.skill.service.SkillGapService;
import com.general_auth.student.dto.request.StudentProfileRequest;
import com.general_auth.student.dto.response.StudentProfileResponse;
import com.general_auth.student.service.StudentService;
import com.general_auth.user.entity.Role;
import com.general_auth.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final SkillGapService skillGapService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> me(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        AuthUtils.requireRole(user, Role.STUDENT);
        return ResponseEntity.ok(ApiResponse.success("Student profile", studentService.toResponse(studentService.getProfile(user))));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<StudentProfileResponse>> updateMe(Authentication authentication,
                                                                        @Valid @RequestBody StudentProfileRequest request) {
        User user = (User) authentication.getPrincipal();
        AuthUtils.requireRole(user, Role.STUDENT);
        return ResponseEntity.ok(ApiResponse.success("Student profile updated", studentService.updateProfile(user, request)));
    }

    @GetMapping("/me/skill-gaps")
    public ResponseEntity<ApiResponse<SkillGapResponse>> skillGaps(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        AuthUtils.requireRole(user, Role.STUDENT);
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis", skillGapService.getSkillGaps(user)));
    }
}