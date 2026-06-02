package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.WatchVariantRequest;
import TAWactch.example.TAWatch.dto.respone.WatchVariantResponse;
import TAWactch.example.TAWatch.entity.Watch;
import TAWactch.example.TAWatch.entity.WatchVariant;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.WatchVariantMapper;
import TAWactch.example.TAWatch.repository.WatchRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
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
        watchVariant.setStockQuantity(request.stockQuantity() != null ? request.stockQuantity() : 0);
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
        watchVariantMapper.partialUpdate(request, watchVariant);
        return watchVariantMapper.toResponse(watchVariantRepo.save(watchVariant));
    }

    public void delete(int id) {
        if (!watchVariantRepo.existsById(id)) {
            throw new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND);
        }
        watchVariantRepo.deleteById(id);
    }
}
