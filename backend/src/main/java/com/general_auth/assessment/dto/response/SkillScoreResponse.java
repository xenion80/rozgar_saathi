package com.general_auth.assessment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillScoreResponse {
    private String skill;
    private Integer proficiency;
}