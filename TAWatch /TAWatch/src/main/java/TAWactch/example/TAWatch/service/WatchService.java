package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.WatchRequest;
import TAWactch.example.TAWatch.dto.respone.WatchResponse;
import TAWactch.example.TAWatch.entity.Watch;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.WatchMapper;
import TAWactch.example.TAWatch.repository.BrandRepo;
import TAWactch.example.TAWatch.repository.CategoryRepo;
import TAWactch.example.TAWatch.repository.SegmentRepo;
import TAWactch.example.TAWatch.repository.WatchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class WatchService {

    @Autowired
    private WatchRepo watchRepo;
    @Autowired
    private BrandRepo brandRepo;
    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    private SegmentRepo segmentRepo;
    @Autowired
    private WatchMapper watchMapper;

    public List<WatchResponse> getAllWatches() {
        return watchRepo.findAll().stream()
                .map(watchMapper::toResponse)
                .toList();
    }

    public WatchResponse getWatchById(int id) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        return watchMapper.toResponse(watch);
    }

    public WatchResponse createWatch(WatchRequest request) {
        if (watchRepo.existsBySku(request.sku())) {
            throw new AppException(ErrorCode.WATCH_SKU_EXISTS);
        }
        Watch watch = watchMapper.toEntity(request);
        watch.setBrand(brandRepo.findById(request.brandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND)));
        watch.setCategory(categoryRepo.findById(request.categoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
        watch.setSegment(segmentRepo.findById(request.segmentId())
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND)));
        watch.setIsActive(request.isActive() != null ? request.isActive() : true);
        watch.setCreatedAt(Instant.now());
        watch.setUpdatedAt(Instant.now());
        return watchMapper.toResponse(watchRepo.save(watch));
    }

    public WatchResponse updateWatch(int id, WatchRequest request) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        if (!watch.getSku().equals(request.sku()) && watchRepo.existsBySku(request.sku())) {
            throw new AppException(ErrorCode.WATCH_SKU_EXISTS);
        }
        watchMapper.partialUpdate(request, watch);
        if (request.brandId() != null) {
            watch.setBrand(brandRepo.findById(request.brandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND)));
        }
        if (request.categoryId() != null) {
            watch.setCategory(categoryRepo.findById(request.categoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
        }
        if (request.segmentId() != null) {
            watch.setSegment(segmentRepo.findById(request.segmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND)));
        }
        watch.setUpdatedAt(Instant.now());
        return watchMapper.toResponse(watchRepo.save(watch));
    }

    public void deleteWatch(int id) {
        if (!watchRepo.existsById(id)) {
            throw new AppException(ErrorCode.WATCH_NOT_FOUND);
        }
        watchRepo.deleteById(id);
    }
}
