package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.dto.respone.SegmentResponse;
import TAWactch.example.TAWatch.entity.Segment;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.SegmentMapper;
import TAWactch.example.TAWatch.repository.SegmentRepo;
import TAWactch.example.TAWatch.utils.SlugUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SegmentService {

    @Autowired
    private SegmentRepo segmentRepo;

    @Autowired
    private SegmentMapper segmentMapper;

    public List<SegmentResponse> getAllSegments() {
        return segmentRepo.findAll().stream()
                .map(segmentMapper::toResponse)
                .toList();
    }

    public SegmentResponse getSegmentById(int id) {
        Segment segment = segmentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND));
        return segmentMapper.toResponse(segment);
    }

    public SegmentResponse getSegmentBySlug(String slug) {
        Segment segment = segmentRepo.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND));
        return segmentMapper.toResponse(segment);
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
        return segmentMapper.toResponse(segmentRepo.save(segment));
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
        return segmentMapper.toResponse(segmentRepo.save(segment));
    }

    public void deleteSegment(int id) {
        if (!segmentRepo.existsById(id)) {
            throw new AppException(ErrorCode.SEGMENT_NOT_FOUND);
        }
        segmentRepo.deleteById(id);
    }
}
