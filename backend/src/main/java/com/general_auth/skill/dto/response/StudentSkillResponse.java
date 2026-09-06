package com.general_auth.skill.dto.response;

import com.general_auth.skill.entity.SkillSource;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentSkillResponse {
    private Long id;
    private SkillResponse skill;
    private Integer proficiency;
    private SkillSource source;
    private LocalDateTime updatedAt;
}