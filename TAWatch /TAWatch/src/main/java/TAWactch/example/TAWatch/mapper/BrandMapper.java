package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.BrandRequest;
import TAWactch.example.TAWatch.dto.respone.BrandResponse;
import TAWactch.example.TAWatch.entity.Brand;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface BrandMapper {

    Brand toEntity(BrandRequest request);

    BrandResponse toResponse(Brand brand);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Brand partialUpdate(BrandRequest request, @MappingTarget Brand brand);
}
