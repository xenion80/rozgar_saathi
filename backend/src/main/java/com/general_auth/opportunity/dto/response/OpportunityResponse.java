package com.general_auth.opportunity.dto.response;

import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.entity.OpportunityType;
import com.general_auth.opportunity.entity.WorkMode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpportunityResponse {
    private Long id;
    private Long recruiterId;
    private String title;
    private String description;
    private OpportunityType type;
    private String companyName;
    private String location;
    private WorkMode workMode;
    private String minimumQualification;
    private OpportunityStatus status;
    private LocalDate applicationDeadline;
    private LocalDateTime createdAt;
    private List<OpportunitySkillResponse> requiredSkills;
    private Long applicantCount;
    private Long shortlistedCount;
}