package com.general_auth.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
public class CloudinaryService {

    private Cloudinary cloudinary;

    @Value("${cloudinary.url:}")
    private String cloudinaryUrl;

    @PostConstruct
    public void init() {
        if (cloudinaryUrl == null || cloudinaryUrl.trim().isEmpty() || "your_cloudinary_url_here".equals(cloudinaryUrl)) {
            log.warn("Cloudinary URL is not configured. File uploads will be disabled.");
            return;
        }
        cloudinary = new Cloudinary(cloudinaryUrl);
        log.info("Cloudinary service initialized successfully.");
    }

    public CloudinaryFileResponse uploadFile(MultipartFile multipartFile, String studentName) throws IOException {
        if (cloudinary == null) {
            throw new IllegalStateException("Cloudinary service is not configured.");
        }

        Map<?, ?> params = ObjectUtils.asMap(
                "folder", "rozgar_saathi_resumes",
                "resource_type", "auto"
        );

        Map<?, ?> uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), params);

        String uploadedPublicId = (String) uploadResult.get("public_id");
        String secureUrl = (String) uploadResult.get("secure_url");

        return new CloudinaryFileResponse(uploadedPublicId, secureUrl);
    }

    public void deleteFile(String publicId) {
        if (cloudinary == null) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Failed to delete file from Cloudinary: " + publicId, e);
        }
    }

    public static class CloudinaryFileResponse {
        private String fileId;
        private String webViewLink;

        public CloudinaryFileResponse(String fileId, String webViewLink) {
            this.fileId = fileId;
            this.webViewLink = webViewLink;
        }

        public String getFileId() {
            return fileId;
        }

        public String getWebViewLink() {
            return webViewLink;
        }
    }
}
