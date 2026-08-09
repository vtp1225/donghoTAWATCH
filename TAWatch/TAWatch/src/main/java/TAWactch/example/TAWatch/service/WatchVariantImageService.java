package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.WatchImageReorderRequest;
import TAWactch.example.TAWatch.dto.request.WatchVariantImageBatchRequest;
import TAWactch.example.TAWatch.dto.request.WatchVariantImageRequest;
import TAWactch.example.TAWatch.dto.respone.WatchVariantImageResponse;
import TAWactch.example.TAWatch.entity.WatchVariant;
import TAWactch.example.TAWatch.entity.WatchVariantImage;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.WatchVariantImageMapper;
import TAWactch.example.TAWatch.repository.WatchRepo;
import TAWactch.example.TAWatch.repository.WatchVariantImageRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
public class WatchVariantImageService {

    @Autowired
    private WatchVariantImageRepo variantImageRepo;

    @Autowired
    private WatchVariantRepo variantRepo;

    @Autowired
    private WatchRepo watchRepo;

    @Autowired
    private WatchVariantImageMapper variantImageMapper;

    @Autowired
    private CloudinaryService cloudinaryService;

    public List<WatchVariantImageResponse> getAllByVariantId(int variantId) {
        if (!variantRepo.existsById(variantId)) {
            throw new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND);
        }
        return variantImageRepo.findByVariantIdOrderBySortOrderAsc(variantId).stream()
                .map(variantImageMapper::toResponse)
                .toList();
    }

    public WatchVariantImageResponse getById(int id) {
        WatchVariantImage image = variantImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
        return variantImageMapper.toResponse(image);
    }

    public WatchVariantImageResponse create(WatchVariantImageRequest request) {
        WatchVariant variant = variantRepo.findById(request.variantId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
        WatchVariantImage image = variantImageMapper.toEntity(request);
        image.setVariant(variant);
        image.setIsPrimary(request.isPrimary() != null ? request.isPrimary() : false);
        image.setIsMainImage(request.isMainImage() != null ? request.isMainImage() : false);
        image.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        return variantImageMapper.toResponse(variantImageRepo.save(image));
    }

    public WatchVariantImageResponse update(int id, WatchVariantImageRequest request) {
        WatchVariantImage image = variantImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
        if (request.variantId() != null) {
            WatchVariant variant = variantRepo.findById(request.variantId())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
            image.setVariant(variant);
        }
        variantImageMapper.partialUpdate(request, image);
        return variantImageMapper.toResponse(variantImageRepo.save(image));
    }

    public WatchVariantImageResponse uploadAndCreate(MultipartFile file, Integer variantId,
                                                     String altText, Boolean isPrimary,
                                                     Boolean isMainImage, Integer sortOrder) {
        WatchVariant variant = variantRepo.findById(variantId)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));

        Map<?, ?> uploadResult = cloudinaryService.uploadFile(file, "tawatch/watches");

        WatchVariantImage image = new WatchVariantImage();
        image.setVariant(variant);
        image.setUrl((String) uploadResult.get("secure_url"));
        image.setPublicId((String) uploadResult.get("public_id"));
        image.setAltText(altText);
        image.setIsPrimary(isPrimary != null ? isPrimary : false);
        image.setIsMainImage(isMainImage != null ? isMainImage : false);
        image.setSortOrder(sortOrder != null ? sortOrder : 0);
        return variantImageMapper.toResponse(variantImageRepo.save(image));
    }

    public void delete(int id) {
        WatchVariantImage image = variantImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
        if (image.getPublicId() != null) {
            cloudinaryService.deleteFile(image.getPublicId());
        }
        variantImageRepo.deleteById(id);
    }

    public WatchVariantImageResponse getMainImageByWatchId(int watchId) {
        if (!watchRepo.existsById(watchId)) {
            throw new AppException(ErrorCode.WATCH_NOT_FOUND);
        }
        WatchVariantImage image = variantImageRepo.findFirstByVariant_Watch_IdAndIsMainImageTrue(watchId)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
        return variantImageMapper.toResponse(image);
    }

    @Transactional
    public WatchVariantImageResponse setPrimary(int id) {
        WatchVariantImage target = variantImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
        List<WatchVariantImage> siblings = variantImageRepo.findByVariantId(target.getVariant().getId());
        siblings.forEach(img -> img.setIsPrimary(false));
        variantImageRepo.saveAll(siblings);
        target.setIsPrimary(true);
        return variantImageMapper.toResponse(variantImageRepo.save(target));
    }

    @Transactional
    public WatchVariantImageResponse setMainImage(int id) {
        WatchVariantImage target = variantImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
        Integer watchId = target.getVariant().getWatch().getId();
        List<WatchVariantImage> allImages = variantImageRepo.findByVariant_Watch_Id(watchId);
        allImages.forEach(img -> img.setIsMainImage(false));
        variantImageRepo.saveAll(allImages);
        target.setIsMainImage(true);
        return variantImageMapper.toResponse(variantImageRepo.save(target));
    }

    public List<WatchVariantImageResponse> batchCreate(WatchVariantImageBatchRequest request) {
        WatchVariant variant = variantRepo.findById(request.variantId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
        List<WatchVariantImage> images = request.images().stream().map(item -> {
            WatchVariantImage img = new WatchVariantImage();
            img.setVariant(variant);
            img.setUrl(item.url());
            img.setAltText(item.altText());
            img.setIsPrimary(item.isPrimary() != null ? item.isPrimary() : false);
            img.setIsMainImage(item.isMainImage() != null ? item.isMainImage() : false);
            img.setSortOrder(item.sortOrder() != null ? item.sortOrder() : 0);
            return img;
        }).toList();
        return variantImageRepo.saveAll(images).stream()
                .map(variantImageMapper::toResponse)
                .toList();
    }

    public List<WatchVariantImageResponse> reorder(WatchImageReorderRequest request) {
        List<WatchVariantImage> images = request.orders().stream().map(item -> {
            WatchVariantImage img = variantImageRepo.findById(item.id())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND));
            img.setSortOrder(item.sortOrder());
            return img;
        }).toList();
        return variantImageRepo.saveAll(images).stream()
                .map(variantImageMapper::toResponse)
                .toList();
    }

    @Transactional
    public void deleteAllByVariantId(int variantId) {
        if (!variantRepo.existsById(variantId)) {
            throw new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND);
        }
        List<WatchVariantImage> images = variantImageRepo.findByVariantId(variantId);
        images.stream()
                .filter(img -> img.getPublicId() != null)
                .forEach(img -> cloudinaryService.deleteFile(img.getPublicId()));
        variantImageRepo.deleteByVariantId(variantId);
    }
}
