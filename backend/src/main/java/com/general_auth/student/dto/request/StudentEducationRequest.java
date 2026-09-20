package com.general_auth.student.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class StudentEducationRequest {

    // ── Graduation ─────────────────────────────────────────────────────────
    private String collegeName;
    private String degree;
    private String branch;

    @Min(value = 2000, message = "graduationYear must be >= 2000")
    @Max(value = 2040, message = "graduationYear must be <= 2040")
    private Integer graduationYear;

    @DecimalMin(value = "0.0", message = "CGPA must be >= 0.0")
    @DecimalMax(value = "10.0", message = "CGPA must be <= 10.0")
    private Double cgpa;

    // ── Class 12 ───────────────────────────────────────────────────────────
    private String twelfthSchoolName;
    private String twelfthBoard;
    private String twelfthMarks;

    // ── Class 10 ───────────────────────────────────────────────────────────
    private String tenthSchoolName;
    private String tenthBoard;
    private String tenthMarks;
}
