package TAWactch.example.TAWatch.product.mapper;

import TAWactch.example.TAWatch.product.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.product.dto.response.SegmentResponse;
import TAWactch.example.TAWatch.product.entity.Segment;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface SegmentMapper {

    Segment toEntity(SegmentRequest request);

    SegmentResponse toResponse(Segment segment);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Segment partialUpdate(SegmentRequest request, @MappingTarget Segment segment);
}
