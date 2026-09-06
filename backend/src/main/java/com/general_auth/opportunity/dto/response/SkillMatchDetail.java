package com.general_auth.opportunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillMatchDetail {
    private String skill;
    private Integer currentProficiency;
    private Integer requiredProficiency;
    private boolean matched;
}