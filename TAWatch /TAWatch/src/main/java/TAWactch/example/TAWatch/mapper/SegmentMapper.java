package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.dto.respone.SegmentResponse;
import TAWactch.example.TAWatch.entity.Segment;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface SegmentMapper {

    Segment toEntity(SegmentRequest request);

    SegmentResponse toResponse(Segment segment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Segment partialUpdate(SegmentRequest request, @MappingTarget Segment segment);
}
