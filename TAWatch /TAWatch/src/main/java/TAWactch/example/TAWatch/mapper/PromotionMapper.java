package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.PromotionRequest;
import TAWactch.example.TAWatch.dto.respone.PromotionResponse;
import TAWactch.example.TAWatch.entity.Promotion;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface PromotionMapper {

    @Mapping(target = "watches", ignore = true)
    Promotion toEntity(PromotionRequest request);

    @Mapping(target = "watchIds", expression = "java(promotion.getWatches() == null ? java.util.List.of() : promotion.getWatches().stream().map(w -> w.getId()).collect(java.util.stream.Collectors.toList()))")
    @Mapping(target = "watchNames", expression = "java(promotion.getWatches() == null ? java.util.List.of() : promotion.getWatches().stream().map(w -> w.getName()).collect(java.util.stream.Collectors.toList()))")
    PromotionResponse toResponse(Promotion promotion);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "watches", ignore = true)
    Promotion partialUpdate(PromotionRequest request, @MappingTarget Promotion promotion);
}
