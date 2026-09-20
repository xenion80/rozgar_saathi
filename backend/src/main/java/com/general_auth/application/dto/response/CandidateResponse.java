package com.general_auth.application.dto.response;

import com.general_auth.application.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateResponse {
    private Long applicationId;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private ApplicationStatus status;
    private Integer matchScore;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private String coverLetter;
    private String resumeUrl;
}