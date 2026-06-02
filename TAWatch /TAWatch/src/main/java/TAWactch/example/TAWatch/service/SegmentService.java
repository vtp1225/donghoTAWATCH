package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.dto.respone.SegmentResponse;
import TAWactch.example.TAWatch.entity.Segment;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.SegmentMapper;
import TAWactch.example.TAWatch.repository.SegmentRepo;
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

    public SegmentResponse createSegment(SegmentRequest request) {
        if (segmentRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.SEGMENT_NAME_EXISTS);
        }
        return segmentMapper.toResponse(segmentRepo.save(segmentMapper.toEntity(request)));
    }

    public SegmentResponse updateSegment(int id, SegmentRequest request) {
        Segment segment = segmentRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND));
        if (segmentRepo.existsByNameAndIdNot(request.name(), id)) {
            throw new AppException(ErrorCode.SEGMENT_NAME_EXISTS);
        }
        segmentMapper.partialUpdate(request, segment);
        return segmentMapper.toResponse(segmentRepo.save(segment));
    }

    public void deleteSegment(int id) {
        if (!segmentRepo.existsById(id)) {
            throw new AppException(ErrorCode.SEGMENT_NOT_FOUND);
        }
        segmentRepo.deleteById(id);
    }
}
