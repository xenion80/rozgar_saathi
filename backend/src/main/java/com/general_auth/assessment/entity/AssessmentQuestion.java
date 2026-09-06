package com.general_auth.assessment.entity;

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
@Table(name = "assessment_questions")
public class AssessmentQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assessment_id", nullable = false)
    private Assessment assessment;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType;

    /** The skill this question measures, e.g. Java. */
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "target_skill_id", nullable = false)
    private Skill targetSkill;

    /** Comma-separated options for MULTIPLE_CHOICE questions; null/empty for SHORT_ANSWER. */
    @Column(columnDefinition = "TEXT")
    private String options;

    @Column(nullable = false)
    private String correctAnswer;

    @Column(nullable = false)
    private Integer weight;
}