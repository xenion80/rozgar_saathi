package com.general_auth.student.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentEducationResponse {

    private Long id;

    // ── Graduation ─────────────────────────────────────────────────────────
    private String collegeName;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private Double cgpa;

    // ── Class 12 ───────────────────────────────────────────────────────────
    private String twelfthSchoolName;
    private String twelfthBoard;
    private String twelfthMarks;

    // ── Class 10 ───────────────────────────────────────────────────────────
    private String tenthSchoolName;
    private String tenthBoard;
    private String tenthMarks;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
