package com.general_auth.skill.dto.request;

import com.general_auth.skill.entity.SkillSource;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentSkillRequest {

    @NotNull(message = "skillId is required")
    private Long skillId;

    @NotNull(message = "proficiency is required")
    @Min(value = 1, message = "proficiency must be between 1 and 5")
    @Max(value = 5, message = "proficiency must be between 1 and 5")
    private Integer proficiency;

    /** Optional. Defaults to MANUAL for student-added skills. */
    private SkillSource source;
}