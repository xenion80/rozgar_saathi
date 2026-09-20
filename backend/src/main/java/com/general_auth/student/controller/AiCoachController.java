package com.general_auth.student.controller;

import com.general_auth.student.dto.AiCoachRequestDto;
import com.general_auth.student.dto.AiCoachResponseDto;
import com.general_auth.student.service.AiCoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.general_auth.common.response.ApiResponse;

@RestController
@RequestMapping("/api/student/coach")
public class AiCoachController {

    private final AiCoachService aiCoachService;

    @Autowired
    public AiCoachController(AiCoachService aiCoachService) {
        this.aiCoachService = aiCoachService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiCoachResponseDto>> chat(
            @AuthenticationPrincipal com.general_auth.user.entity.User user,
            @RequestBody AiCoachRequestDto request) {
        try {
            String responseText = aiCoachService.getCoachResponse(request, user);
            return ResponseEntity.ok(ApiResponse.success("Success", AiCoachResponseDto.builder().response(responseText).build()));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}
