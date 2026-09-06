package com.general_auth.opportunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpportunitySkillResponse {
    private Long id;
    private Long skillId;
    private String skillName;
    private Integer requiredProficiency;
    private Integer importance;
}