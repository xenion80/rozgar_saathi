package com.general_auth.student.dto.request;

import lombok.Data;

@Data
public class StudentProfileRequest {

    private String collegeName;
    private String degree;
    private String branch;
    private Integer graduationYear;

    private String bio;
    private String targetRole;
}