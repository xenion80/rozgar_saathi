package com.general_auth.opportunity.dto.request;

import com.general_auth.opportunity.entity.OpportunityStatus;
import com.general_auth.opportunity.entity.OpportunityType;
import com.general_auth.opportunity.entity.WorkMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpportunityRequest {

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "description is required")
    private String description;

    @NotNull(message = "type is required")
    private OpportunityType type;

    @NotBlank(message = "companyName is required")
    private String companyName;

    private String location;

    @NotNull(message = "workMode is required")
    private WorkMode workMode;

    private String minimumQualification;

    @NotNull(message = "status is required")
    private OpportunityStatus status;

    @Future(message = "applicationDeadline must be in the future")
    private LocalDate applicationDeadline;

    @Valid
    @Size(max = 30, message = "at most 30 required skills")
    private List<OpportunitySkillRequest> skills;
}