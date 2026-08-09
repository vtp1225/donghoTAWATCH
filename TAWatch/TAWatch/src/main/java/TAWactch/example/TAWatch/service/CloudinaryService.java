package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.exception.AppException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public Map<?, ?> uploadFile(MultipartFile file, String folder) {
        try {
            return cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", folder));
        } catch (IOException e) {
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            System.err.println("Khong the xoa anh tren Cloudinary: " + publicId);
        }
    }
}
