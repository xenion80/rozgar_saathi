package com.general_auth.skill.controller;

import com.general_auth.common.response.ApiResponse;
import com.general_auth.skill.dto.request.StudentSkillRequest;
import com.general_auth.skill.dto.response.SkillResponse;
import com.general_auth.skill.dto.response.StudentSkillResponse;
import com.general_auth.skill.service.SkillService;
import com.general_auth.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    /** Master skill catalogue (any authenticated user). */
    @GetMapping("/api/skills")
    public ResponseEntity<ApiResponse<List<SkillResponse>>> listSkills() {
        return ResponseEntity.ok(ApiResponse.success("Skills catalogue", skillService.listSkills()));
    }

    @GetMapping("/api/students/me/skills")
    public ResponseEntity<ApiResponse<List<StudentSkillResponse>>> mySkills(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("My skills", skillService.getStudentSkills(user)));
    }

    @PostMapping("/api/students/me/skills")
    public ResponseEntity<ApiResponse<StudentSkillResponse>> addSkill(Authentication authentication,
                                                                      @Valid @RequestBody StudentSkillRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Skill added", skillService.addStudentSkill(user, request)));
    }

    @PutMapping("/api/students/me/skills/{skillId}")
    public ResponseEntity<ApiResponse<StudentSkillResponse>> updateSkill(Authentication authentication,
                                                                         @PathVariable Long skillId,
                                                                         @Valid @RequestBody StudentSkillRequest request) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success("Skill updated", skillService.updateStudentSkill(user, skillId, request)));
    }
}