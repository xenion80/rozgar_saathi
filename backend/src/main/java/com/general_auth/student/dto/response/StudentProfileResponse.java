package com.general_auth.student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileResponse {
    private Long id;
    private Long userId;
    private String name;
    private String email;
    private String bio;
    private String targetRole;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}