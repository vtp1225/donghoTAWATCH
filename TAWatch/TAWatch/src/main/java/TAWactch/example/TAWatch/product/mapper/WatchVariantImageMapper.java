package TAWactch.example.TAWatch.product.mapper;

import TAWactch.example.TAWatch.product.dto.request.WatchVariantImageRequest;
import TAWactch.example.TAWatch.product.dto.response.WatchVariantImageResponse;
import TAWactch.example.TAWatch.product.entity.WatchVariantImage;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface WatchVariantImageMapper {

    @Mapping(target = "variant", ignore = true)
    WatchVariantImage toEntity(WatchVariantImageRequest request);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "variant.dialColor.name", target = "dialColor")
    @Mapping(source = "variant.strapColor.name", target = "strapColor")
    WatchVariantImageResponse toResponse(WatchVariantImage image);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "variant", ignore = true)
    WatchVariantImage partialUpdate(WatchVariantImageRequest request, @MappingTarget WatchVariantImage image);
}
