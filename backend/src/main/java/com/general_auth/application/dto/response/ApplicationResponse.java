package com.general_auth.application.dto.response;

import com.general_auth.application.entity.ApplicationStatus;
import com.general_auth.opportunity.entity.OpportunityType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationResponse {
    private Long id;
    private Long opportunityId;
    private String opportunityTitle;
    private String companyName;
    private OpportunityType opportunityType;
    private ApplicationStatus status;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
    /** Explainable match score of the student against this opportunity. */
    private Integer matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
}