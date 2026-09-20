package com.general_auth.student.service;

import com.general_auth.common.exception.ResourceNotFoundException;
import com.general_auth.common.service.CloudinaryService;
import com.general_auth.student.dto.response.ResumeResponse;
import com.general_auth.student.entity.Resume;
import com.general_auth.student.entity.StudentProfile;
import com.general_auth.student.repository.ResumeRepository;
import com.general_auth.student.repository.StudentProfileRepository;
import com.general_auth.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CloudinaryService cloudinaryService;

    public ResumeResponse uploadResume(User user, MultipartFile file) throws IOException {
        StudentProfile studentProfile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        CloudinaryService.CloudinaryFileResponse driveFile = cloudinaryService.uploadFile(file, user.getName());

        Resume resume = new Resume();
        resume.setStudentProfile(studentProfile);
        resume.setFileName(file.getOriginalFilename());
        resume.setFileUrl(driveFile.getWebViewLink());
        resume.setFileId(driveFile.getFileId());

        resume = resumeRepository.save(resume);
        return mapToResponse(resume);
    }

    @Transactional(readOnly = true)
    public List<ResumeResponse> listMyResumes(User user) {
        StudentProfile studentProfile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return resumeRepository.findByStudentProfile(studentProfile).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteResume(User user, Long resumeId) {
        StudentProfile studentProfile = studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Resume resume = resumeRepository.findByIdAndStudentProfile(resumeId, studentProfile)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found or does not belong to you"));

        if (resume.getFileId() != null) {
            cloudinaryService.deleteFile(resume.getFileId());
        }

        resumeRepository.delete(resume);
    }

    private ResumeResponse mapToResponse(Resume resume) {
        ResumeResponse response = new ResumeResponse();
        response.setId(resume.getId());
        response.setFileName(resume.getFileName());
        response.setFileUrl(resume.getFileUrl());
        if (resume.getCreatedAt() != null) {
            response.setCreatedAt(resume.getCreatedAt().toString());
        }
        return response;
    }
}
