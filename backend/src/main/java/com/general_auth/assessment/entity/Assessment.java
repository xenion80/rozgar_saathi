package com.general_auth.assessment.entity;

import com.general_auth.student.entity.StudentProfile;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "assessments")
public class Assessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Null for seeded template assessments. A non-null student means this row is a
     * per-student attempt that was created when the student started the template.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    private StudentProfile student;

    /** For attempts, the id of the template assessment this attempt was started from. Null for templates. */
    private Long templateId;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private AssessmentStatus status;

    private LocalDateTime startedAt;

    private LocalDateTime completedAt;
}