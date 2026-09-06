package com.general_auth.opportunity.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpportunityMatchSummary {
    private Long opportunityId;
    private String title;
    private String companyName;
    private Integer matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}