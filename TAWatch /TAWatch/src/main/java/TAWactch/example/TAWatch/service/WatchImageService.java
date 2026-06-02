package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.WatchImageBatchRequest;
import TAWactch.example.TAWatch.dto.request.WatchImageItemRequest;
import TAWactch.example.TAWatch.dto.request.WatchImageReorderRequest;
import TAWactch.example.TAWatch.dto.request.WatchImageRequest;
import TAWactch.example.TAWatch.dto.respone.WatchImageResponse;
import TAWactch.example.TAWatch.entity.Watch;
import TAWactch.example.TAWatch.entity.WatchImage;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.WatchImageMapper;
import TAWactch.example.TAWatch.repository.WatchImageRepo;
import TAWactch.example.TAWatch.repository.WatchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchImageService {

    @Autowired
    private WatchImageRepo watchImageRepo;

    @Autowired
    private WatchRepo watchRepo;

    @Autowired
    private WatchImageMapper watchImageMapper;

    public List<WatchImageResponse> getAllByWatchId(int watchId) {
        if (!watchRepo.existsById(watchId)) {
            throw new AppException(ErrorCode.WATCH_NOT_FOUND);
        }
        return watchImageRepo.findByWatchIdOrderBySortOrderAsc(watchId).stream()
                .map(watchImageMapper::toResponse)
                .toList();
    }

    public WatchImageResponse getById(int id) {
        WatchImage watchImage = watchImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_IMAGE_NOT_FOUND));
        return watchImageMapper.toResponse(watchImage);
    }

    public WatchImageResponse create(WatchImageRequest request) {
        Watch watch = watchRepo.findById(request.watchId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        WatchImage watchImage = watchImageMapper.toEntity(request);
        watchImage.setWatch(watch);
        watchImage.setIsPrimary(request.isPrimary() != null ? request.isPrimary() : false);
        watchImage.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        return watchImageMapper.toResponse(watchImageRepo.save(watchImage));
    }

    public WatchImageResponse update(int id, WatchImageRequest request) {
        WatchImage watchImage = watchImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_IMAGE_NOT_FOUND));
        if (request.watchId() != null) {
            Watch watch = watchRepo.findById(request.watchId())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
            watchImage.setWatch(watch);
        }
        watchImageMapper.partialUpdate(request, watchImage);
        return watchImageMapper.toResponse(watchImageRepo.save(watchImage));
    }

    public void delete(int id) {
        if (!watchImageRepo.existsById(id)) {
            throw new AppException(ErrorCode.WATCH_IMAGE_NOT_FOUND);
        }
        watchImageRepo.deleteById(id);
    }

    @Transactional
    public WatchImageResponse setPrimary(int id) {
        WatchImage target = watchImageRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_IMAGE_NOT_FOUND));
        List<WatchImage> siblings = watchImageRepo.findByWatchId(target.getWatch().getId());
        siblings.forEach(img -> img.setIsPrimary(false));
        watchImageRepo.saveAll(siblings);
        target.setIsPrimary(true);
        return watchImageMapper.toResponse(watchImageRepo.save(target));
    }

    public List<WatchImageResponse> batchCreate(WatchImageBatchRequest request) {
        Watch watch = watchRepo.findById(request.watchId())
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        List<WatchImage> images = request.images().stream().map(item -> {
            WatchImage img = new WatchImage();
            img.setWatch(watch);
            img.setUrl(item.url());
            img.setAltText(item.altText());
            img.setIsPrimary(item.isPrimary() != null ? item.isPrimary() : false);
            img.setSortOrder(item.sortOrder() != null ? item.sortOrder() : 0);
            return img;
        }).toList();
        return watchImageRepo.saveAll(images).stream()
                .map(watchImageMapper::toResponse)
                .toList();
    }

    public List<WatchImageResponse> reorder(WatchImageReorderRequest request) {
        List<WatchImage> images = request.orders().stream().map(item -> {
            WatchImage img = watchImageRepo.findById(item.id())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_IMAGE_NOT_FOUND));
            img.setSortOrder(item.sortOrder());
            return img;
        }).toList();
        return watchImageRepo.saveAll(images).stream()
                .map(watchImageMapper::toResponse)
                .toList();
    }

    @Transactional
    public void deleteAllByWatchId(int watchId) {
        if (!watchRepo.existsById(watchId)) {
            throw new AppException(ErrorCode.WATCH_NOT_FOUND);
        }
        watchImageRepo.deleteByWatchId(watchId);
    }
}
