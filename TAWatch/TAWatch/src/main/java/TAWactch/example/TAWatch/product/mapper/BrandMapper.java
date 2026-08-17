package TAWactch.example.TAWatch.product.mapper;

import TAWactch.example.TAWatch.product.dto.request.BrandRequest;
import TAWactch.example.TAWatch.product.dto.response.BrandResponse;
import TAWactch.example.TAWatch.product.entity.Brand;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface BrandMapper {

    Brand toEntity(BrandRequest request);

    BrandResponse toResponse(Brand brand);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Brand partialUpdate(BrandRequest request, @MappingTarget Brand brand);
}
