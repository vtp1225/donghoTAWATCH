package TAWactch.example.TAWatch.product.service;

import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.product.dto.request.WatchVariantRequest;
import TAWactch.example.TAWatch.product.dto.response.WatchVariantResponse;
import TAWactch.example.TAWatch.product.entity.Color;
import TAWactch.example.TAWatch.product.entity.Watch;
import TAWactch.example.TAWatch.product.entity.WatchVariant;
import TAWactch.example.TAWatch.product.mapper.WatchVariantMapper;
import TAWactch.example.TAWatch.product.repository.ColorRepo;
import TAWactch.example.TAWatch.product.repository.WatchRepo;
import TAWactch.example.TAWatch.product.repository.WatchVariantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WatchVariantService {

    @Autowired
    private WatchVariantRepo watchVariantRepo;

    @Autowired
    private WatchRepo watchRepo;

    @Autowired
    private ColorRepo colorRepo;

    @Autowired
    private WatchVariantMapper watchVariantMapper;

    public List<WatchVariantResponse> getAllByWatchId(int watchId) {
        if (!watchRepo.existsById(watchId)) {
            throw new AppException(ErrorCode.WATCH_NOT_FOUND);
        }
        return watchVariantRepo.findByWatchId(watchId).stream()
                .map(watchVariantMapper::toResponse)
                .toList();
    }

    public WatchVariantResponse getById(int id) {
        WatchVariant watchVariant = watchVariantRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
        return watchVariantMapper.toResponse(watchVariant);
    }

    public WatchVariantResponse create(WatchVariantRequest request) {
        Watch watch = watchRepo.findById(request.watchId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        WatchVariant watchVariant = watchVariantMapper.toEntity(request);
        watchVariant.setWatch(watch);
        watchVariant.setDialColor(resolveColor(request.dialColorId()));
        watchVariant.setStrapColor(resolveColor(request.strapColorId()));
        watchVariant.setStockQuantity(0);
        watchVariant.setIsActive(request.isActive() != null ? request.isActive() : true);
        return watchVariantMapper.toResponse(watchVariantRepo.save(watchVariant));
    }

    public WatchVariantResponse update(int id, WatchVariantRequest request) {
        WatchVariant watchVariant = watchVariantRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
        if (request.watchId() != null) {
            Watch watch = watchRepo.findById(request.watchId())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
            watchVariant.setWatch(watch);
        }
        if (request.dialColorId() != null) {
            watchVariant.setDialColor(resolveColor(request.dialColorId()));
        }
        if (request.strapColorId() != null) {
            watchVariant.setStrapColor(resolveColor(request.strapColorId()));
        }
        watchVariantMapper.partialUpdate(request, watchVariant);
        return watchVariantMapper.toResponse(watchVariantRepo.save(watchVariant));
    }

    public void delete(int id) {
        if (!watchVariantRepo.existsById(id)) {
            throw new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND);
        }
        watchVariantRepo.deleteById(id);
    }

    private Color resolveColor(Integer colorId) {
        if (colorId == null) return null;
        return colorRepo.findById(colorId)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
    }
}
