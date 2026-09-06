package com.general_auth.opportunity.entity;

import com.general_auth.skill.entity.Skill;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "opportunity_skills",
        uniqueConstraints = @UniqueConstraint(name = "uk_opportunity_skill", columnNames = {"opportunity_id", "skill_id"}))
public class OpportunitySkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "opportunity_id", nullable = false)
    private Opportunity opportunity;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    /** Minimum proficiency (1-5) the opportunity expects for this skill. */
    @Column(nullable = false)
    private Integer requiredProficiency;

    /** How important this skill is to the opportunity (1-5). Reserved for future weighted scoring. */
    @Column(nullable = false)
    private Integer importance;
}