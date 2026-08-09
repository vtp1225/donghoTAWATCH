package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.respone.ColorResponse;
import TAWactch.example.TAWatch.entity.Color;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface ColorMapper {
    ColorResponse toResponse(Color color);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Color partialUpdate(TAWactch.example.TAWatch.dto.request.ColorRequest request, @MappingTarget Color color);
}
