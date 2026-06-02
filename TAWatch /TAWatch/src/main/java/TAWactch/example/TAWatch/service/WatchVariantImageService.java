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
import TAWactch.example.TAWatch.repository.WatchVariantImageRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchVariantImageService {

    @Autowired
    private WatchVariantImageRepo variantImageRepo;

    @Autowired
    private WatchVariantRepo variantRepo;

    @Autowired
    private WatchVariantImageMapper variantImageMapper;

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

    public void delete(int id) {
        if (!variantImageRepo.existsById(id)) {
            throw new AppException(ErrorCode.WATCH_VARIANT_IMAGE_NOT_FOUND);
        }
        variantImageRepo.deleteById(id);
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

    public List<WatchVariantImageResponse> batchCreate(WatchVariantImageBatchRequest request) {
        WatchVariant variant = variantRepo.findById(request.variantId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
        List<WatchVariantImage> images = request.images().stream().map(item -> {
            WatchVariantImage img = new WatchVariantImage();
            img.setVariant(variant);
            img.setUrl(item.url());
            img.setAltText(item.altText());
            img.setIsPrimary(item.isPrimary() != null ? item.isPrimary() : false);
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
        variantImageRepo.deleteByVariantId(variantId);
    }
}
