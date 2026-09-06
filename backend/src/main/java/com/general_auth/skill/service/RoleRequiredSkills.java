package com.general_auth.skill.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Small prototype career ontology: target role -> required skills with minimum proficiency.
 * Used by the skill-gap analysis and shared with the seed data.
 */
public final class RoleRequiredSkills {

    public record RequiredSkill(String name, int requiredProficiency) {
    }

    private static final Map<String, List<RequiredSkill>> ROLE_SKILLS = new LinkedHashMap<>();

    static {
        ROLE_SKILLS.put("Backend Developer", List.of(
                new RequiredSkill("Java", 3),
                new RequiredSkill("Spring Boot", 3),
                new RequiredSkill("SQL", 3),
                new RequiredSkill("Git", 2),
                new RequiredSkill("Docker", 3)
        ));
        ROLE_SKILLS.put("Frontend Developer", List.of(
                new RequiredSkill("HTML/CSS", 3),
                new RequiredSkill("JavaScript", 3),
                new RequiredSkill("React", 3),
                new RequiredSkill("Git", 2)
        ));
        ROLE_SKILLS.put("Full Stack Developer", List.of(
                new RequiredSkill("Java", 3),
                new RequiredSkill("Spring Boot", 2),
                new RequiredSkill("React", 3),
                new RequiredSkill("SQL", 3),
                new RequiredSkill("Git", 2)
        ));
        ROLE_SKILLS.put("Data Analyst", List.of(
                new RequiredSkill("SQL", 3),
                new RequiredSkill("Python", 3),
                new RequiredSkill("Excel", 2),
                new RequiredSkill("Power BI", 2)
        ));
    }

    private RoleRequiredSkills() {
    }

    public static List<RequiredSkill> forRole(String role) {
        return ROLE_SKILLS.getOrDefault(role, List.of());
    }

    public static boolean isKnownRole(String role) {
        return ROLE_SKILLS.containsKey(role);
    }

    public static Map<String, List<RequiredSkill>> all() {
        return ROLE_SKILLS;
    }
}