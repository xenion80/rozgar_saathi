package com.general_auth.skill.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillGapResponse {
    private String targetRole;
    private List<SkillGapDetail> matchedSkills;
    private List<SkillGapDetail> missingSkills;
}