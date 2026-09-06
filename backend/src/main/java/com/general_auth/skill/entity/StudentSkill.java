package com.general_auth.skill.entity;

import com.general_auth.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student_skills",
        uniqueConstraints = @UniqueConstraint(name = "uk_student_skill", columnNames = {"student_id", "skill_id"}))
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    /** Proficiency from 1 (beginner) to 5 (expert). */
    @Column(nullable = false)
    private Integer proficiency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillSource source;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}