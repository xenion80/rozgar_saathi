package com.general_auth.student.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class StudentProfileRequest {

    private String collegeName;

    private String degree;

    private String branch;

    @Min(value = 2000, message = "graduationYear must be >= 2000")
    @Max(value = 2040, message = "graduationYear must be <= 2040")
    private Integer graduationYear;

    private String bio;

    private String targetRole;
}