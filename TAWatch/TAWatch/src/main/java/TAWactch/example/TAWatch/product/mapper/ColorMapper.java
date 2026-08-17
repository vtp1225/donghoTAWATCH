package TAWactch.example.TAWatch.product.mapper;

import TAWactch.example.TAWatch.product.dto.request.ColorRequest;
import TAWactch.example.TAWatch.product.dto.response.ColorResponse;
import TAWactch.example.TAWatch.product.entity.Color;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface ColorMapper {
    ColorResponse toResponse(Color color);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Color partialUpdate(ColorRequest request, @MappingTarget Color color);
}
