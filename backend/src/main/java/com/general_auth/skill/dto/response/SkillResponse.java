package com.general_auth.skill.dto.response;

import com.general_auth.skill.entity.SkillCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillResponse {
    private Long id;
    private String name;
    private SkillCategory category;
    private String description;
}