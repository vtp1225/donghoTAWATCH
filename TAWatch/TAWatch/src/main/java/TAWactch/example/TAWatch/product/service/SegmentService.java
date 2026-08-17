package TAWactch.example.TAWatch.product.service;

import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.common.util.SlugUtils;
import TAWactch.example.TAWatch.product.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.product.dto.response.SegmentResponse;
import TAWactch.example.TAWatch.product.entity.Segment;
import TAWactch.example.TAWatch.product.mapper.SegmentMapper;
import TAWactch.example.TAWatch.product.repository.SegmentRepo;
import TAWactch.example.TAWatch.product.repository.WatchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SegmentService {

    @Autowired
    private SegmentRepo segmentRepo;

    @Autowired
    private SegmentMapper segmentMapper;

    @Autowired
    private WatchRepo watchRepo;

    private SegmentResponse mapToResponseWithCount(Segment segment) {
        SegmentResponse baseResponse = segmentMapper.toResponse(segment);
        long count = watchRepo.countBySegmentIdAndIsActiveTrue(segment.getId());
        return new SegmentResponse(
                baseResponse.id(),
                baseResponse.name(),
                baseResponse.slug(),
                baseResponse.deliveryMethod(),
                count
        );
    }

    public List<SegmentResponse> getAllSegments() {
        return segmentRepo.findAll().stream()
                .map(this::mapToResponseWithCount)
                .toList();
    }

    public SegmentResponse getSegmentById(int id) {
        Segment segment = segmentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND));
        return mapToResponseWithCount(segment);
    }

    public SegmentResponse getSegmentBySlug(String slug) {
        Segment segment = segmentRepo.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND));
        return mapToResponseWithCount(segment);
    }

    public SegmentResponse createSegment(SegmentRequest request) {
        if (segmentRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.SEGMENT_NAME_EXISTS);
        }
        String slug = request.slug() != null && !request.slug().isBlank()
                ? request.slug() : SlugUtils.toSlug(request.name());
        if (segmentRepo.existsBySlug(slug)) {
            throw new AppException(ErrorCode.SEGMENT_SLUG_EXISTS);
        }
        Segment segment = segmentMapper.toEntity(request);
        segment.setSlug(slug);
        return mapToResponseWithCount(segmentRepo.save(segment));
    }

    public SegmentResponse updateSegment(int id, SegmentRequest request) {
        Segment segment = segmentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND));
        if (segmentRepo.existsByNameAndIdNot(request.name(), id)) {
            throw new AppException(ErrorCode.SEGMENT_NAME_EXISTS);
        }
        String slug = request.slug() != null && !request.slug().isBlank()
                ? request.slug() : SlugUtils.toSlug(request.name());
        if (segmentRepo.existsBySlugAndIdNot(slug, id)) {
            throw new AppException(ErrorCode.SEGMENT_SLUG_EXISTS);
        }
        segmentMapper.partialUpdate(request, segment);
        segment.setSlug(slug);
        return mapToResponseWithCount(segmentRepo.save(segment));
    }

    public void deleteSegment(int id) {
        if (!segmentRepo.existsById(id)) {
            throw new AppException(ErrorCode.SEGMENT_NOT_FOUND);
        }
        segmentRepo.deleteById(id);
    }
}
