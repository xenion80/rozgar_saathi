package com.general_auth.skill.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillGapDetail {
    private String skill;
    private Integer currentProficiency;
    private Integer requiredProficiency;
}