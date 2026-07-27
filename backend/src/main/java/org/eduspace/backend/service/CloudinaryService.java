package org.eduspace.backend.service;

import java.io.IOException;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload file lên Cloudinary, trả về secure_url (đường dẫn https) của file.
     */
    public String uploadFile(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "eduspace",
                        "resource_type", "auto"));

        return result.get("secure_url").toString();
    }

    public String uploadAvatar(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "eduspace/avatars",
                        "resource_type", "image",
                        "width", 400,
                        "height", 400,
                        "crop", "fill",
                        "gravity", "face"));

        return result.get("secure_url").toString();
    }
}
