package com.general_auth.student.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "student_education")
public class StudentEducation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** One education record per student profile. */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_profile_id", unique = true, nullable = false)
    private StudentProfile studentProfile;

    // ── Graduation ─────────────────────────────────────────────────────────
    private String collegeName;
    private String degree;
    private String branch;
    private Integer graduationYear;

    /** CGPA on a 10-point scale, e.g. 8.5 */
    private Double cgpa;

    // ── Class 12 ───────────────────────────────────────────────────────────
    private String twelfthSchoolName;
    private String twelfthBoard;

    /** Percentage or grade string, e.g. "92%" */
    private String twelfthMarks;

    // ── Class 10 ───────────────────────────────────────────────────────────
    private String tenthSchoolName;
    private String tenthBoard;

    /** Percentage or grade string, e.g. "95%" */
    private String tenthMarks;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
