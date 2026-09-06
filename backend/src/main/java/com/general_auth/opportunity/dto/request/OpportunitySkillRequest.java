package com.general_auth.opportunity.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OpportunitySkillRequest {

    @NotNull(message = "skillId is required")
    private Long skillId;

    @NotNull(message = "requiredProficiency is required")
    @Min(value = 1, message = "requiredProficiency must be between 1 and 5")
    @Max(value = 5, message = "requiredProficiency must be between 1 and 5")
    private Integer requiredProficiency;

    @NotNull(message = "importance is required")
    @Min(value = 1, message = "importance must be between 1 and 5")
    @Max(value = 5, message = "importance must be between 1 and 5")
    private Integer importance;
}