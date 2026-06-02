package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.WatchVariantImageRequest;
import TAWactch.example.TAWatch.dto.respone.WatchVariantImageResponse;
import TAWactch.example.TAWatch.entity.WatchVariantImage;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface WatchVariantImageMapper {

    @Mapping(target = "variant", ignore = true)
    WatchVariantImage toEntity(WatchVariantImageRequest request);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "variant.dialColor", target = "dialColor")
    @Mapping(source = "variant.strapColor", target = "strapColor")
    WatchVariantImageResponse toResponse(WatchVariantImage image);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "variant", ignore = true)
    WatchVariantImage partialUpdate(WatchVariantImageRequest request, @MappingTarget WatchVariantImage image);
}
