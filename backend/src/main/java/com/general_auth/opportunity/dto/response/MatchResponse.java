package com.general_auth.opportunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchResponse {
    private Long opportunityId;
    private String opportunityTitle;
    private Integer matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private boolean eligible;
    private List<SkillMatchDetail> skillDetails;
}