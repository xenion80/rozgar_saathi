package com.general_auth.skill.repository;

import com.general_auth.skill.entity.Skill;
import com.general_auth.skill.entity.StudentSkill;
import com.general_auth.student.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {
    List<StudentSkill> findByStudent(StudentProfile student);

    List<StudentSkill> findByStudentId(Long studentId);

    Optional<StudentSkill> findByStudentAndSkill(StudentProfile student, Skill skill);

    Optional<StudentSkill> findByStudentIdAndSkillId(Long studentId, Long skillId);

    boolean existsByStudentAndSkill(StudentProfile student, Skill skill);
}