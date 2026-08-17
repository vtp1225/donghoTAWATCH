package TAWactch.example.TAWatch.product.mapper;

import TAWactch.example.TAWatch.product.dto.request.WatchRequest;
import TAWactch.example.TAWatch.product.dto.response.WatchResponse;
import TAWactch.example.TAWatch.product.entity.Watch;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface WatchMapper {

    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "segment", ignore = true)
    Watch toEntity(WatchRequest request);

    @Mapping(source = "brand.id", target = "brandId")
    @Mapping(source = "brand.name", target = "brandName")
    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    @Mapping(source = "segment.id", target = "segmentId")
    @Mapping(source = "segment.name", target = "segmentName")
    @Mapping(target = "minPrice", ignore = true)
    @Mapping(target = "mainImageUrl", ignore = true)
    @Mapping(target = "defaultVariantId", ignore = true)
    @Mapping(target = "totalStock", ignore = true)
    WatchResponse toResponse(Watch watch);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "segment", ignore = true)
    Watch partialUpdate(WatchRequest request, @MappingTarget Watch watch);
}
