package com.general_auth.skill.repository;

import com.general_auth.skill.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByName(String name);

    boolean existsByName(String name);

    List<Skill> findAllByOrderByNameAsc();
}